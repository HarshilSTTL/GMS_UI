import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson, nextId } from '@/lib/db';
import { logAction, logError, logData } from '@/lib/logger';
import type { Complaint } from '@/types/complaint';

type Action =
  | 'acknowledge'
  | 'assign'
  | 'forward'
  | 'reassign'
  | 'transfer'
  | 'resolve'
  | 'escalate'
  | 'de_escalate'
  | 'add_note'
  | 'reopen'
  | 'feedback'
  | 'send_update'
  | 'begin_work'
  | 'request_document'
  | 'resubmit_document'
  | 'edit_grievance';

function addTimelineEntry(complaint: Complaint, type: any, title: string, actor: string, actorRole: 'citizen' | 'officer' | 'system', description?: string) {
  const tlId = `tl-${complaint.id}-${complaint.timeline.length + 1}`;
  complaint.timeline.push({
    id: tlId,
    type,
    title,
    actor,
    actorRole,
    timestamp: new Date().toISOString(),
    description
  });
}

function createNotification(userId: string, title: string, message: string, grievanceId: string, type: string) {
  try {
    const notifications = readJson<any[]>('notifications.json');
    notifications.push({
      id: `n${notifications.length + 1}`,
      userId,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      type,
      grievanceId
    });
    writeJson('notifications.json', notifications);
  } catch {}
}

function addAuditEntry(action: string, userId: string, details: string) {
  try {
    const audit = readJson<any[]>('audit-log.json');
    audit.push({
      id: `audit-${Date.now()}`,
      action,
      userId,
      details,
      timestamp: new Date().toISOString()
    });
    writeJson('audit-log.json', audit);
  } catch {}
}

// GET /api/grievances/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaints = readJson<Complaint[]>('complaints.json');
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) {
      return NextResponse.json({ error: 'Grievance not found.' }, { status: 404 });
    }
    return NextResponse.json({ data: complaint });
  } catch (error) {
    logError('GET grievance by ID failed', String(error));
    return NextResponse.json({ error: 'Failed to fetch grievance.' }, { status: 500 });
  }
}

// PATCH /api/grievances/[id] — Update grievance with actions
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, actorId, ...rest } = body;

    const complaints = readJson<Complaint[]>('complaints.json');
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) {
      return NextResponse.json({ error: 'Grievance not found.' }, { status: 404 });
    }

    // Read actor name
    const users = readJson<any[]>('users.json');
    const actor = users.find(u => u.id === actorId);
    const actorName = actor?.name || 'System';
    const actorRole = actor?.role || 'system';

    const now = new Date().toISOString();
    complaint.updatedAt = now;

    switch (action as Action) {
      // ========== ACKNOWLEDGE ==========
      case 'acknowledge': {
        if (!['open', 'pending'].includes(complaint.status)) {
          return NextResponse.json({ error: `Cannot acknowledge grievance in ${complaint.status} status.` }, { status: 400 });
        }
        complaint.status = 'acknowledged';
        addTimelineEntry(complaint, 'acknowledged', 'Grievance Acknowledged', actorName, actorRole, 'Grievance has been acknowledged and is being reviewed.');
        createNotification(complaint.citizenId, 'Grievance Acknowledged', `Your grievance ${complaint.token} has been acknowledged.`, id, 'status_update');
        logAction('ACKNOWLEDGE grievance', actorId, `grievance: ${id}`);
        break;
      }

      // ========== ASSIGN ==========
      case 'assign': {
        const { officerId } = rest;
        const officer = users.find(u => u.id === officerId);
        if (!officer) {
          return NextResponse.json({ error: 'Officer not found.' }, { status: 404 });
        }
        complaint.assignedTo = {
          id: officer.id,
          name: officer.name,
          initials: officer.initials,
          color: officer.avatarColor,
          role: officer.designation,
          department: officer.department,
          workload: 'ok'
        };
        if (complaint.status === 'open' || complaint.status === 'pending' || complaint.status === 'acknowledged') {
          complaint.status = 'in_progress';
        }
        addTimelineEntry(complaint, 'assigned', `Assigned to ${officer.name}`, actorName, actorRole, `Grievance assigned to ${officer.name} (${officer.designation}, ${officer.department}).`);
        createNotification(complaint.citizenId, 'Officer Assigned', `${officer.name} from ${officer.department} has been assigned to your grievance ${complaint.token}.`, id, 'assignment');
        createNotification(officer.id, 'New Grievance Assigned', `Grievance ${complaint.token} (${complaint.category}) has been assigned to you.`, id, 'assignment');
        logAction('ASSIGN grievance', actorId, `grievance: ${id}, officer: ${officerId}`);
        break;
      }

      // ========== FORWARD ==========
      case 'forward': {
        const { toDepartment, reason } = rest;
        const oldDept = complaint.department;
        complaint.department = toDepartment;
        complaint.assignedTo = null;
        if (complaint.status !== 'escalated') {
          complaint.status = 'open';
        }
        addTimelineEntry(complaint, 'forwarded', `Forwarded to ${toDepartment}`, actorName, actorRole, reason ? `Reason: ${reason}` : `Forwarded from ${oldDept} to ${toDepartment}.`);
        createNotification(complaint.citizenId, 'Grievance Forwarded', `Your grievance ${complaint.token} has been forwarded from ${oldDept} to ${toDepartment}.`, id, 'status_update');
        addAuditEntry('FORWARD', actorId, `Grievance ${id} forwarded from ${oldDept} to ${toDepartment}`);
        logAction('FORWARD grievance', actorId, `grievance: ${id}, from: ${oldDept}, to: ${toDepartment}`);
        break;
      }

      // ========== REASSIGN ==========
      case 'reassign': {
        const { newOfficerId, reason: reassignReason } = rest;
        const oldOfficer = complaint.assignedTo?.name || 'Unassigned';
        const newOfficer = users.find(u => u.id === newOfficerId);
        if (!newOfficer) {
          return NextResponse.json({ error: 'Officer not found.' }, { status: 404 });
        }
        complaint.assignedTo = {
          id: newOfficer.id,
          name: newOfficer.name,
          initials: newOfficer.initials,
          color: newOfficer.avatarColor,
          role: newOfficer.designation,
          department: newOfficer.department,
          workload: 'ok'
        };
        addTimelineEntry(complaint, 'reassigned', `Reassigned from ${oldOfficer} to ${newOfficer.name}`, actorName, actorRole, reassignReason || 'No reason provided.');
        createNotification(complaint.citizenId, 'Officer Changed', `Your grievance ${complaint.token} has been reassigned to ${newOfficer.name}.`, id, 'status_update');
        createNotification(newOfficer.id, 'Grievance Reassigned', `Grievance ${complaint.token} has been reassigned to you from ${oldOfficer}.`, id, 'assignment');
        addAuditEntry('REASSIGN', actorId, `Grievance ${id}: ${oldOfficer} → ${newOfficer.name}`);
        logAction('REASSIGN grievance', actorId, `grievance: ${id}, new officer: ${newOfficerId}`);
        break;
      }

      // ========== TRANSFER ==========
      case 'transfer': {
        const { toDistrict, toDept, transferReason } = rest;
        const oldDistrict = complaint.district;
        const oldDept = complaint.department;
        if (toDept) complaint.department = toDept;
        if (toDistrict) complaint.district = toDistrict;
        complaint.assignedTo = null;
        complaint.status = 'open';
        addTimelineEntry(complaint, 'transferred', `Transferred to ${toDept || oldDept}, ${toDistrict || oldDistrict}`, actorName, actorRole, transferReason || `Transferred from ${oldDept}, ${oldDistrict}.`);
        createNotification(complaint.citizenId, 'Grievance Transferred', `Your grievance ${complaint.token} has been transferred to ${toDept || oldDept}, ${toDistrict || oldDistrict}.`, id, 'status_update');
        addAuditEntry('TRANSFER', actorId, `Grievance ${id}: ${oldDept}/${oldDistrict} → ${toDept || oldDept}/${toDistrict || oldDistrict}`);
        logAction('TRANSFER grievance', actorId, `grievance: ${id}`);
        break;
      }

      // ========== RESOLVE ==========
      case 'resolve': {
        const { resolution, resolutionNotes } = rest;
        const resolutionText = resolution || resolutionNotes;
        if (!resolutionText?.trim()) {
          return NextResponse.json({ error: 'Resolution notes are required.' }, { status: 400 });
        }
        if (['resolved', 'closed'].includes(complaint.status)) {
          return NextResponse.json({ error: 'Grievance is already resolved or closed.' }, { status: 400 });
        }
        complaint.status = 'resolved';
        complaint.resolvedAt = now;
        complaint.resolution = resolutionText;
        complaint.slaStatus = 'ok';
        complaint.slaDaysLeft = 0;
        addTimelineEntry(complaint, 'resolved', 'Grievance Resolved', actorName, actorRole, `Resolution: ${resolutionText}`);
        createNotification(complaint.citizenId, 'Grievance Resolved', `Your grievance ${complaint.token} has been resolved. Please provide your feedback.`, id, 'resolution');
        addAuditEntry('RESOLVE', actorId, `Grievance ${id} resolved with notes: ${resolutionText}`);
        logAction('RESOLVE grievance', actorId, `grievance: ${id}`);
        break;
      }

      // ========== ESCALATE ==========
      case 'escalate': {
        const { escalationReason, escalateTo } = rest;
        complaint.status = 'escalated';
        complaint.slaStatus = 'breach';
        addTimelineEntry(complaint, 'escalated', `Escalated${escalateTo ? ` to ${escalateTo}` : ''}`, actorName, actorRole, escalationReason || 'Grievance has been escalated.');
        createNotification(complaint.citizenId, 'Grievance Escalated', `Your grievance ${complaint.token} has been escalated to higher authority.`, id, 'sla_breach');
        addAuditEntry('ESCALATE', actorId, `Grievance ${id} escalated. Reason: ${escalationReason}`);
        logAction('ESCALATE grievance', actorId, `grievance: ${id}`);
        break;
      }

      // ========== DE-ESCALATE ==========
      case 'de_escalate': {
        const { deEscalateReason } = rest;
        complaint.status = 'in_progress';
        complaint.slaStatus = 'ok';
        addTimelineEntry(complaint, 'status_change', 'De-escalated to In Progress', actorName, actorRole, deEscalateReason || 'Grievance de-escalated back to in progress.');
        createNotification(complaint.citizenId, 'Grievance Update', `Your grievance ${complaint.token} is back in progress.`, id, 'status_update');
        logAction('DE-ESCALATE grievance', actorId, `grievance: ${id}`);
        break;
      }

      // ========== ADD NOTE ==========
      case 'add_note': {
        const { note } = rest;
        if (!note) {
          return NextResponse.json({ error: 'Note content is required.' }, { status: 400 });
        }
        addTimelineEntry(complaint, 'note', `Note added by ${actorName}`, actorName, actorRole, note);
        logAction('ADD NOTE', actorId, `grievance: ${id}`);
        break;
      }

      // ========== REOPEN ==========
      case 'reopen': {
        const { reopenReason } = rest;
        if (complaint.status !== 'resolved' && complaint.status !== 'closed') {
          return NextResponse.json({ error: 'Can only reopen resolved or closed grievances.' }, { status: 400 });
        }
        complaint.status = 'open';
        complaint.resolvedAt = null;
        complaint.feedback = null;
        complaint.rating = null;
        addTimelineEntry(complaint, 'reopened', 'Grievance Reopened', actorName, actorRole, reopenReason || 'Citizen requested reopening.');
        createNotification(complaint.assignedTo?.id || '', 'Grievance Reopened', `Grievance ${complaint.token} has been reopened by the citizen.`, id, 'status_update');
        logAction('REOPEN grievance', actorId, `grievance: ${id}`);
        break;
      }

      // ========== FEEDBACK ==========
      case 'feedback': {
        const { feedbackText, rating } = rest;
        complaint.feedback = feedbackText || '';
        complaint.rating = rating || null;
        addTimelineEntry(complaint, 'feedback', `Feedback submitted: ${rating}/5 stars`, actorName, actorRole, feedbackText || '');
        logAction('FEEDBACK', actorId, `grievance: ${id}, rating: ${rating}`);
        break;
      }

      // ========== SEND UPDATE ==========
      case 'send_update': {
        const { message, statusUpdate } = rest;
        if (statusUpdate && ['in_progress', 'under_review', 'acknowledged'].includes(statusUpdate)) {
          complaint.status = statusUpdate;
        }
        addTimelineEntry(complaint, 'status_change', `Update: ${message || 'Status update'}`, actorName, actorRole, message);
        createNotification(complaint.citizenId, 'Grievance Update', `Update on ${complaint.token}: ${message}`, id, 'status_update');
        logAction('SEND UPDATE', actorId, `grievance: ${id}`);
        break;
      }

      // ========== BEGIN WORK ==========
      case 'begin_work': {
        complaint.status = 'in_progress';
        addTimelineEntry(complaint, 'status_change', 'Work Started', actorName, actorRole, `${actorName} has started working on this grievance.`);
        createNotification(complaint.citizenId, 'Work Started', `Work has begun on your grievance ${complaint.token}.`, id, 'status_update');
        logAction('BEGIN WORK', actorId, `grievance: ${id}`);
        break;
      }

      // ========== REQUEST DOCUMENT ==========
      case 'request_document': {
        const { requestNote } = rest;
        if (!requestNote?.trim()) {
          return NextResponse.json({ error: 'Request note is required.' }, { status: 400 });
        }
        complaint.status = 'document_requested' as any;
        (complaint as any).documentRequest = {
          note: requestNote,
          requestedBy: actorId,
          requestedByName: actorName,
          requestedAt: now,
        };
        addTimelineEntry(complaint, 'document_requested', 'Document Requested', actorName, actorRole, requestNote);
        createNotification(complaint.citizenId, 'Action Required: Document Requested', `Officer ${actorName} has requested an additional document for your grievance ${complaint.token}. Please log in to resubmit.`, id, 'status_update');
        logAction('REQUEST DOCUMENT', actorId, `grievance: ${id}`);
        break;
      }

      // ========== RESUBMIT DOCUMENT ==========
      case 'resubmit_document': {
        const { newDescription, attachmentUrl } = rest;
        if (complaint.status !== 'document_requested') {
          return NextResponse.json({ error: 'Can only resubmit when document is requested.' }, { status: 400 });
        }
        complaint.status = 'in_progress';
        (complaint as any).isResubmitted = true;
        if (newDescription?.trim()) complaint.description = newDescription;
        if (attachmentUrl) (complaint as any).resubmittedAttachmentUrl = attachmentUrl;
        addTimelineEntry(complaint, 'document_resubmitted', 'Document Resubmitted by Citizen', actorName, 'citizen', attachmentUrl ? `Document uploaded: ${attachmentUrl}` : 'Citizen resubmitted the grievance with updated information.');
        const officerId = (complaint.assignedTo as any)?.id;
        if (officerId) {
          createNotification(officerId, 'Document Resubmitted', `Citizen has resubmitted documents for grievance ${complaint.token}. Please review.`, id, 'status_update');
        }
        logAction('RESUBMIT DOCUMENT', actorId, `grievance: ${id}`);
        break;
      }

      // ========== EDIT GRIEVANCE ==========
      case 'edit_grievance': {
        const { newDescription, attachmentUrl } = rest;
        const hasChanges = (newDescription?.trim() && newDescription !== complaint.description) || attachmentUrl;
        if (!hasChanges) {
          return NextResponse.json({ error: 'No changes provided.' }, { status: 400 });
        }
        if (newDescription?.trim()) complaint.description = newDescription;
        if (attachmentUrl) {
          if (!complaint.attachments) complaint.attachments = [];
          complaint.attachments.push(attachmentUrl);
        }
        const descChange = newDescription?.trim() ? 'Updated description' : '';
        const fileChange = attachmentUrl ? 'Uploaded new document' : '';
        const changes = [descChange, fileChange].filter(Boolean).join(' and ');
        addTimelineEntry(complaint, 'grievance_edited', 'Grievance Updated by Citizen', actorName, 'citizen', changes);
        if (complaint.assignedTo?.id) {
          createNotification(complaint.assignedTo.id, 'Grievance Updated', `Citizen has updated grievance ${complaint.token}. Please review the changes.`, id, 'status_update');
        }
        logAction('EDIT GRIEVANCE', actorId, `grievance: ${id}, changes: ${changes}`);
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    writeJson('complaints.json', complaints);

    return NextResponse.json({ data: complaint });
  } catch (error) {
    logError('PATCH grievance failed', String(error));
    return NextResponse.json({ error: 'Failed to update grievance.' }, { status: 500 });
  }
}

// DELETE /api/grievances/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaints = readJson<Complaint[]>('complaints.json');
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Grievance not found.' }, { status: 404 });
    }
    complaints.splice(index, 1);
    writeJson('complaints.json', complaints);
    logData('DELETE', 'grievances', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('DELETE grievance failed', String(error));
    return NextResponse.json({ error: 'Failed to delete grievance.' }, { status: 500 });
  }
}
