import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface NotifTemplate {
  id: string;
  name: string;
  event: string;
  channels: string[];
  content: string;
  active: boolean;
}

export interface ChannelConfig {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
}

export function useNotificationTemplates() {
  const [templates, setTemplates] = useState<NotifTemplate[]>([]);
  const [channels, setChannels] = useState<ChannelConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/notification-templates');
      const data = await res.json();
      setTemplates(data.templates);
      setChannels(data.channels);
    } catch (error) {
      toast.error('Failed to fetch notification templates');
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (template: Omit<NotifTemplate, 'id'>) => {
    try {
      const res = await fetch('/api/notification-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      const newTemplate = await res.json();
      setTemplates([...templates, newTemplate]);
      toast.success('Template created');
      return newTemplate;
    } catch (error) {
      toast.error('Failed to create template');
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<NotifTemplate>) => {
    try {
      const res = await fetch('/api/notification-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const updated = await res.json();
      setTemplates(templates.map(t => t.id === id ? updated : t));
      toast.success('Template updated');
      return updated;
    } catch (error) {
      toast.error('Failed to update template');
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await fetch(`/api/notification-templates?id=${id}`, { method: 'DELETE' });
      setTemplates(templates.filter(t => t.id !== id));
      toast.success('Template deleted');
    } catch (error) {
      toast.error('Failed to delete template');
      throw error;
    }
  };

  const toggleTemplate = async (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      await updateTemplate(id, { active: !template.active });
    }
  };

  return { templates, channels, loading, addTemplate, updateTemplate, deleteTemplate, toggleTemplate };
}
