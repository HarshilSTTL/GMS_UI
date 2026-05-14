'use client';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, FileText, MapPin, Sparkles, ClipboardList, Target } from 'lucide-react';
import { GmsIcon } from '@/components/ui/GmsIcon';

// ── Types ────────────────────────────────────────────────────────────────────
type EligField = { id: string; label: string; type: 'number' | 'select'; placeholder?: string; options?: string[] };
type EligResult = { ok: boolean; reason: string };
type Scheme = {
  id: string; name: string; nameGu: string; domain: string;
  iconName: string; color: string; flagship: boolean;
  benefit: string; benefitGu: string; department: string; tagline?: string; summary: string;
  eligibility: { criteria: string[]; form: EligField[]; check: (v: Record<string, string>) => EligResult };
  documents: string[]; apply: string;
};

// ── Scheme data (real Gujarat / Central govt schemes) ────────────────────────
const SCHEMES: Scheme[] = [
  // HEALTH
  {
    id: 'PMJAY', domain: 'health', iconName: 'Hospital', color: '#DC2626', flagship: true,
    name: 'Ayushman Bharat — PM-JAY (MA Yojana)', nameGu: 'આયુષ્માન ભારત — પ્રધાનમંત્રી જન આરોગ્ય યોજના',
    benefit: '₹5 lakh / family / year cashless treatment', benefitGu: 'કુટુંબ દીઠ વાર્ષિક ₹૫ લાખ કેશલેસ સારવાર',
    department: 'HFWD · GMERS', tagline: "World's largest health assurance scheme",
    summary: 'Cashless secondary & tertiary care at empanelled hospitals. Covers 1,949 procedures including pre-existing conditions from Day 1.',
    eligibility: {
      criteria: ['SECC-2011 listed deprived families (rural)', 'Occupation-based deprived (urban)', 'Annual family income ≤ ₹4 lakh (MA Vatsalya extension)', 'Valid Aadhaar + ration card linked'],
      form: [
        { id: 'income', label: 'Annual family income (₹)', type: 'number', placeholder: '350000' },
        { id: 'area', label: 'Area type', type: 'select', options: ['Rural', 'Urban'] },
        { id: 'aadhaar', label: 'Aadhaar linked to ration card?', type: 'select', options: ['Yes', 'No'] },
        { id: 'ration', label: 'Ration card type', type: 'select', options: ['BPL', 'APL', 'AAY (Antyodaya)', 'None'] },
      ],
      check: (v) => {
        if (v.aadhaar === 'No') return { ok: false, reason: 'Aadhaar must be linked to your ration card to enroll.' };
        if (v.ration === 'BPL' || v.ration === 'AAY (Antyodaya)') return { ok: true, reason: 'BPL/AAY families auto-qualify under SECC-2011.' };
        const inc = parseInt(v.income || '0', 10);
        if (inc > 0 && inc <= 400000) return { ok: true, reason: 'Annual income within ₹4 lakh — covered under MA Vatsalya extension.' };
        return { ok: false, reason: 'Income exceeds ₹4 lakh and ration card is not BPL/AAY. Not eligible.' };
      },
    },
    documents: ['Aadhaar Card', 'Ration Card', 'SECC-2011 verification (auto)', 'Family ID'],
    apply: 'PMJAY portal · Common Service Centre · Empanelled hospital kiosk',
  },
  {
    id: 'JSY', domain: 'health', iconName: 'Heart', color: '#7C3AED', flagship: true,
    name: 'Janani Suraksha Yojana (JSY)', nameGu: 'જનની સુરક્ષા યોજના',
    benefit: '₹700 (urban) – ₹1,400 (rural) cash + free institutional delivery', benefitGu: '₹૭૦૦ (શહેરી) – ₹૧,૪૦૦ (ગ્રામીણ) + મફત પ્રસૂતિ',
    department: 'HFWD · NHM',
    summary: 'Cash assistance for institutional delivery to reduce maternal & neonatal mortality. Includes free transport, drugs, diagnostics under JSSK.',
    eligibility: {
      criteria: ['Pregnant woman aged 19+', 'BPL families OR all SC/ST women regardless of income', 'Up to first 2 live births (LPS states)', 'Delivery at registered govt / accredited private facility'],
      form: [
        { id: 'age', label: 'Age (years)', type: 'number', placeholder: '24' },
        { id: 'caste', label: 'Caste', type: 'select', options: ['General', 'OBC', 'SC', 'ST'] },
        { id: 'bpl', label: 'BPL ration card?', type: 'select', options: ['Yes', 'No'] },
        { id: 'births', label: 'Previous live births', type: 'number', placeholder: '0' },
        { id: 'area', label: 'Area', type: 'select', options: ['Rural', 'Urban'] },
      ],
      check: (v) => {
        const age = parseInt(v.age || '0', 10);
        const births = parseInt(v.births || '0', 10);
        if (age < 19) return { ok: false, reason: 'Mother must be 19 years or older.' };
        if (births > 1) return { ok: false, reason: 'Benefit limited to first 2 live births in Gujarat (LPS).' };
        if (v.caste === 'SC' || v.caste === 'ST') return { ok: true, reason: 'SC/ST women qualify regardless of BPL status.' };
        if (v.bpl === 'Yes') return { ok: true, reason: `Eligible for ₹${v.area === 'Rural' ? '1,400' : '700'} + free delivery & transport.` };
        return { ok: false, reason: 'Non-SC/ST families need BPL card for cash assistance. Free delivery still available under JSSK.' };
      },
    },
    documents: ['MCP Card', 'Aadhaar', 'BPL/Caste certificate', 'Bank account passbook'],
    apply: 'ANM / ASHA worker · PHC · Sub-Centre · Online via NHM portal',
  },
  {
    id: 'CHIRANJEEVI', domain: 'health', iconName: 'User', color: '#0891B2', flagship: false,
    name: 'Chiranjeevi Yojana', nameGu: 'ચિરંજીવી યોજના',
    benefit: 'Free maternity care at private hospitals empanelled by GoG', benefitGu: 'એમ્પેનલ્ડ ખાનગી હોસ્પિટલમાં મફત માતૃ સારવાર',
    department: 'HFWD · NHM',
    summary: 'Public-Private Partnership scheme allowing BPL women to access private hospital maternity care free of cost. Pioneered in Gujarat, replicated nationally.',
    eligibility: {
      criteria: ['BPL ration card holder', 'Pregnant women', 'Delivery at empanelled private facility'],
      form: [
        { id: 'bpl', label: 'BPL card holder?', type: 'select', options: ['Yes', 'No'] },
        { id: 'preg', label: 'Currently pregnant or post-natal (within 42 days)?', type: 'select', options: ['Yes', 'No'] },
      ],
      check: (v) => {
        if (v.bpl !== 'Yes') return { ok: false, reason: 'Chiranjeevi is exclusively for BPL families.' };
        if (v.preg !== 'Yes') return { ok: false, reason: 'Active pregnancy or recent delivery (≤42 days) required.' };
        return { ok: true, reason: 'Eligible — visit any Chiranjeevi-empanelled private hospital with your BPL card.' };
      },
    },
    documents: ['BPL Card', 'Aadhaar', 'MCP Card'],
    apply: 'Empanelled private hospital · CDHO office',
  },
  // WATER
  {
    id: 'JJM', domain: 'water', iconName: 'Droplet', color: '#0891B2', flagship: true,
    name: 'Jal Jeevan Mission — Har Ghar Jal', nameGu: 'જલ જીવન મિશન — હર ઘર જલ',
    benefit: 'Functional Household Tap Connection — 55 lpcd assured supply', benefitGu: 'ઘરે-ઘરે નળ — દરરોજ ૫૫ લિટર પાણી',
    department: 'WSSD · GWSSB',
    summary: 'Mission to provide tap water connection to every rural household. Gujarat already at 100% coverage in many districts.',
    eligibility: {
      criteria: ['Rural household without functional tap connection', 'Listed in village Gram Panchayat survey', 'One-time contribution of ₹20 (SC/ST/BPL exempt)'],
      form: [
        { id: 'area', label: 'Area type', type: 'select', options: ['Rural', 'Urban'] },
        { id: 'connection', label: 'Existing functional tap connection?', type: 'select', options: ['Yes', 'No'] },
        { id: 'caste', label: 'Caste / category', type: 'select', options: ['General', 'OBC', 'SC', 'ST', 'BPL'] },
      ],
      check: (v) => {
        if (v.area !== 'Rural') return { ok: false, reason: 'JJM covers only rural households. For urban, check AMRUT 2.0.' };
        if (v.connection === 'Yes') return { ok: false, reason: 'You already have a functional tap connection.' };
        const exempt = ['SC', 'ST', 'BPL'].includes(v.caste);
        return { ok: true, reason: `Eligible for FHTC. ${exempt ? 'Contribution waived (SC/ST/BPL).' : 'One-time contribution: ₹20.'}` };
      },
    },
    documents: ['Aadhaar', 'Ration Card', 'Land/House proof'],
    apply: 'Village Water & Sanitation Committee (VWSC) · Gram Panchayat',
  },
  {
    id: 'AMRUT', domain: 'water', iconName: 'Building2', color: '#16A34A', flagship: true,
    name: 'AMRUT 2.0 — Universal Water Supply', nameGu: 'અમૃત ૨.૦ — સાર્વત્રિક પાણી પુરવઠો',
    benefit: 'Universal urban water + sewerage coverage with 24×7 supply targets', benefitGu: 'શહેરી પાણી + ગટર સંપૂર્ણ સુવિધા',
    department: 'UDD · ULB',
    summary: 'Atal Mission for Rejuvenation & Urban Transformation 2.0 — universal coverage of water supply, sewerage and septage management in 500 cities.',
    eligibility: {
      criteria: ['Urban resident in AMRUT-covered city', 'No existing legal tap connection', 'Property tax up-to-date'],
      form: [
        { id: 'city', label: 'City', type: 'select', options: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Other'] },
        { id: 'connection', label: 'Existing connection?', type: 'select', options: ['Yes — working', 'Yes — but not working', 'No'] },
        { id: 'tax', label: 'Property tax dues?', type: 'select', options: ['No dues', 'Pending'] },
      ],
      check: (v) => {
        if (v.connection === 'Yes — working') return { ok: false, reason: 'You already have working connection. File a grievance instead if service is poor.' };
        if (v.tax === 'Pending') return { ok: false, reason: 'Clear pending property tax dues first to apply.' };
        return { ok: true, reason: `Eligible — apply at ${v.city || 'your'} Municipal Corporation water dept.` };
      },
    },
    documents: ['Property tax receipt', 'Aadhaar', 'Address proof'],
    apply: 'Municipal Corporation Water Works dept · Online via city portal',
  },
  // ROADS
  {
    id: 'PMGSY', domain: 'roads', iconName: 'Route', color: '#475569', flagship: true,
    name: 'Pradhan Mantri Gram Sadak Yojana', nameGu: 'પ્રધાનમંત્રી ગ્રામ સડક યોજના',
    benefit: 'All-weather paved road connectivity to unconnected habitations', benefitGu: 'દરેક ઋતુમાં ગામડાંઓને જોડતા પાકા રસ્તાઓ',
    department: 'R&BD · GSRDC',
    summary: 'Centrally Sponsored Scheme to provide all-weather road connectivity to unconnected rural habitations with population ≥250 (plain) / ≥100 (tribal).',
    eligibility: {
      criteria: ['Habitation listed in PMGSY core network', 'Population threshold: 250+ (plain), 100+ (tribal/hilly)', 'Not yet connected by all-weather road'],
      form: [
        { id: 'habitation', label: 'Habitation type', type: 'select', options: ['Plain area', 'Tribal/hilly area'] },
        { id: 'population', label: 'Habitation population', type: 'number', placeholder: '320' },
        { id: 'connected', label: 'Currently connected by paved road?', type: 'select', options: ['Yes', 'Partial / damaged', 'No'] },
      ],
      check: (v) => {
        const pop = parseInt(v.population || '0', 10);
        const min = v.habitation === 'Tribal/hilly area' ? 100 : 250;
        if (pop < min) return { ok: false, reason: `Population (${pop}) below threshold of ${min} for your area type.` };
        if (v.connected === 'Yes') return { ok: false, reason: 'Already connected. File a maintenance grievance instead.' };
        return { ok: true, reason: 'Habitation qualifies. Submit application via Gram Panchayat → ZP → State Rural Roads Authority.' };
      },
    },
    documents: ['Gram Panchayat resolution', 'Census-2011 data', 'Land records'],
    apply: 'Gram Panchayat · Block Development Officer · Zila Panchayat',
  },
  {
    id: 'SADAK', domain: 'roads', iconName: 'AlertTriangle', color: '#D97706', flagship: false,
    name: 'Mukhyamantri Sadak Yojana (Gujarat)', nameGu: 'મુખ્યમંત્રી સડક યોજના',
    benefit: 'State-funded maintenance & upgrade of district + rural roads', benefitGu: 'જિલ્લા + ગ્રામીણ રસ્તાઓની જાળવણી',
    department: 'R&BD',
    summary: 'State scheme for maintenance, widening and upgrade of district roads, ODR and village roads not covered under PMGSY.',
    eligibility: {
      criteria: ['Road in disrepair / damaged', 'District / village road (not NH/SH)', 'Application via local body'],
      form: [
        { id: 'roadType', label: 'Road type', type: 'select', options: ['National Highway', 'State Highway', 'District Road', 'Village Road'] },
        { id: 'condition', label: 'Current condition', type: 'select', options: ['Good', 'Damaged (potholes)', 'Severely damaged', 'No road'] },
      ],
      check: (v) => {
        if (['National Highway', 'State Highway'].includes(v.roadType)) return { ok: false, reason: 'NH/SH covered under separate central/state highway schemes.' };
        if (v.condition === 'Good') return { ok: false, reason: 'Scheme is for repair/upgrade. Current condition is good.' };
        return { ok: true, reason: 'Eligible for inclusion in next maintenance cycle. Submit via Gram Panchayat / Municipality.' };
      },
    },
    documents: ['Gram Panchayat / ULB resolution', 'Photos of damage'],
    apply: 'Local body (Gram Panchayat / Municipality) → R&B Division',
  },
  // URBAN
  {
    id: 'PMAY', domain: 'urban', iconName: 'Home', color: '#F4811F', flagship: true,
    name: 'PMAY-U — Pradhan Mantri Awas Yojana (Urban)', nameGu: 'પ્રધાનમંત્રી આવાસ યોજના (શહેરી)',
    benefit: 'Up to ₹2.67 lakh interest subsidy + ₹1.5 lakh affordable housing grant', benefitGu: '₹૨.૬૭ લાખ સુધી વ્યાજ સબસિડી',
    department: 'UDD · GUDM',
    summary: 'Housing-for-all mission. Credit-Linked Subsidy (CLSS) for EWS/LIG/MIG, Affordable Housing in Partnership (AHP), Beneficiary-led construction.',
    eligibility: {
      criteria: ['Family does not own a pucca house anywhere in India', 'Annual income: EWS ≤ ₹3L, LIG ≤ ₹6L, MIG-I ≤ ₹12L, MIG-II ≤ ₹18L', 'Female ownership/co-ownership mandatory for EWS/LIG'],
      form: [
        { id: 'income', label: 'Annual household income (₹)', type: 'number', placeholder: '450000' },
        { id: 'ownsHouse', label: 'Already own a pucca house?', type: 'select', options: ['Yes', 'No'] },
        { id: 'female', label: 'Female ownership / co-ownership planned?', type: 'select', options: ['Yes', 'No'] },
      ],
      check: (v) => {
        const inc = parseInt(v.income || '0', 10);
        if (v.ownsHouse === 'Yes') return { ok: false, reason: 'Family already owns a pucca house. Not eligible.' };
        if (inc > 1800000) return { ok: false, reason: 'Income exceeds MIG-II ceiling of ₹18 lakh.' };
        let cat = 'EWS';
        if (inc > 1200000) cat = 'MIG-II';
        else if (inc > 600000) cat = 'MIG-I';
        else if (inc > 300000) cat = 'LIG';
        if ((cat === 'EWS' || cat === 'LIG') && v.female === 'No') return { ok: false, reason: `${cat} category requires female ownership / co-ownership.` };
        return { ok: true, reason: `Eligible under ${cat}. ${cat === 'EWS' || cat === 'LIG' ? '₹1.5L grant + interest subsidy' : 'Interest subsidy on home loan'}.` };
      },
    },
    documents: ['Aadhaar (all family members)', 'Income proof', 'Property declaration', 'Bank account'],
    apply: 'Online via PMAY-U portal · ULB Housing Board · CSCs',
  },
  {
    id: 'SBM', domain: 'urban', iconName: 'Trash2', color: '#16A34A', flagship: false,
    name: 'Swachh Bharat Mission — Urban', nameGu: 'સ્વચ્છ ભારત મિશન — શહેરી',
    benefit: '₹12,000 toilet construction subsidy + free door-to-door waste collection', benefitGu: '₹૧૨,૦૦૦ શૌચાલય સહાય + મફત કચરો સંગ્રહ',
    department: 'UDD · ULB',
    summary: 'Sanitation drive — eliminate open defecation, scientific solid waste management, ODF+ / ODF++ certification, plastic-waste-free cities.',
    eligibility: {
      criteria: ['Urban household without functional toilet', 'Income criterion as per ULB norms'],
      form: [
        { id: 'toilet', label: 'Have a functional toilet at home?', type: 'select', options: ['Yes', 'No'] },
        { id: 'income', label: 'Annual income (₹)', type: 'number', placeholder: '180000' },
      ],
      check: (v) => {
        if (v.toilet === 'Yes') return { ok: false, reason: 'Toilet construction subsidy not applicable. Door-to-door collection still active in your ward.' };
        const inc = parseInt(v.income || '0', 10);
        if (inc > 300000) return { ok: false, reason: 'Income exceeds ₹3 lakh. Subsidy targets EWS households.' };
        return { ok: true, reason: 'Eligible for ₹12,000 toilet construction subsidy.' };
      },
    },
    documents: ['Aadhaar', 'Income certificate', 'Property tax receipt'],
    apply: 'ULB Sanitation dept · Common Service Centre',
  },
  // AGRICULTURE
  {
    id: 'PMKISAN', domain: 'agriculture', iconName: 'Leaf', color: '#16A34A', flagship: true,
    name: 'PM-KISAN Samman Nidhi', nameGu: 'પ્રધાનમંત્રી કિસાન સન્માન નિધિ',
    benefit: '₹6,000 / year direct cash to farmers (₹2,000 × 3 instalments)', benefitGu: 'ખેડૂતોને વાર્ષિક ₹૬,૦૦૦ સીધી રોકડ સહાય',
    department: 'AFCD · State Agri Dept',
    summary: 'Direct income support to landholding farmer families — ₹6,000 per year via DBT in three equal instalments of ₹2,000.',
    eligibility: {
      criteria: ['Landholding farmer family (cultivable land in own name)', 'Aadhaar-seeded bank account + land records', 'Excludes: govt employees, taxpayers (≥₹10K/yr), professionals, pensioners (≥₹10K/mo)'],
      form: [
        { id: 'land', label: 'Cultivable land in your name?', type: 'select', options: ['Yes', 'No (tenant/leased)', 'Joint with family'] },
        { id: 'taxpayer', label: 'Income-tax payer?', type: 'select', options: ['Yes', 'No'] },
        { id: 'govtJob', label: 'Govt employee / pensioner > ₹10K/mo?', type: 'select', options: ['Yes', 'No'] },
        { id: 'aadhaar', label: 'Aadhaar-seeded bank account?', type: 'select', options: ['Yes', 'No'] },
      ],
      check: (v) => {
        if (v.land === 'No (tenant/leased)') return { ok: false, reason: 'Only landholding farmers qualify. Tenants are not covered.' };
        if (v.taxpayer === 'Yes') return { ok: false, reason: 'Income-tax payers are excluded.' };
        if (v.govtJob === 'Yes') return { ok: false, reason: 'Govt employees / pensioners drawing ≥ ₹10,000/month are excluded.' };
        if (v.aadhaar === 'No') return { ok: false, reason: 'Aadhaar-seeded bank account is mandatory for DBT.' };
        return { ok: true, reason: 'Eligible — register at pmkisan.gov.in or via VLE / Gram Sevak.' };
      },
    },
    documents: ['Aadhaar', 'Land records (RoR / 7-12)', 'Bank passbook'],
    apply: 'pmkisan.gov.in · CSC · Village Lekhpal / Gram Sevak',
  },
  {
    id: 'PMFBY', domain: 'agriculture', iconName: 'Wheat', color: '#D97706', flagship: true,
    name: 'Pradhan Mantri Fasal Bima Yojana', nameGu: 'પ્રધાનમંત્રી ફસલ બીમા યોજના',
    benefit: 'Crop insurance — premium 1.5–5% (Kharif/Rabi/Hort), rest subsidized', benefitGu: 'પાક વીમો — ખેડૂત હિસ્સો ૧.૫–૫%, બાકી સબસિડી',
    department: 'AFCD · Insurance companies',
    summary: 'Crop insurance against natural calamities, pests, diseases. Farmer pays nominal premium; rest is shared by Centre + State.',
    eligibility: {
      criteria: ['Farmer (loanee or non-loanee) growing notified crops in notified areas', 'Cultivable land record OR sown area certificate', 'Pre-sowing enrolment within cut-off date'],
      form: [
        { id: 'crop', label: 'Crop type', type: 'select', options: ['Cotton', 'Groundnut', 'Wheat', 'Bajra', 'Castor', 'Pulses', 'Other'] },
        { id: 'season', label: 'Season', type: 'select', options: ['Kharif', 'Rabi', 'Horticulture'] },
        { id: 'land', label: 'Have land records (7-12 / 8-A)?', type: 'select', options: ['Yes', 'No'] },
        { id: 'enrolled', label: 'Within enrolment cut-off?', type: 'select', options: ['Yes', 'No', 'Not sure'] },
      ],
      check: (v) => {
        if (v.land !== 'Yes') return { ok: false, reason: 'Land records (7-12 / 8-A) or sown area certificate required.' };
        if (v.enrolled === 'No') return { ok: false, reason: 'Cut-off passed. Wait for next season — Kharif (Jul) / Rabi (Dec).' };
        return { ok: true, reason: `Eligible — ${v.season} ${v.crop} premium: 1.5–2% (Kharif), 1.5% (Rabi), 5% (Horticulture). Apply via bank or PMFBY portal.` };
      },
    },
    documents: ['Aadhaar', 'Land records', 'Bank passbook', 'Sowing declaration'],
    apply: 'Bank · CSC · pmfby.gov.in · State agri portal',
  },
  {
    id: 'KISANSURYA', domain: 'agriculture', iconName: 'Zap', color: '#F4811F', flagship: false,
    name: 'Kisan Suryoday Yojana (Gujarat)', nameGu: 'કિસાન સૂર્યોદય યોજના',
    benefit: 'Daytime electricity (5 AM – 9 PM) for irrigation pumps', benefitGu: 'સિંચાઈ માટે દિવસે વીજળી (૫ AM – ૯ PM)',
    department: 'Energy & Petrochemicals · GUVNL',
    summary: 'Gujarat scheme to provide daytime power supply to farmers for irrigation, replacing the older night-time supply pattern.',
    eligibility: {
      criteria: ['Existing agricultural electricity connection holder', 'Farmer in scheme-rolled-out feeder area'],
      form: [
        { id: 'connection', label: 'Have an agri electricity connection?', type: 'select', options: ['Yes', 'No (applied)', 'No'] },
        { id: 'district', label: 'District', type: 'select', options: ['Banaskantha', 'Sabarkantha', 'Aravalli', 'Mehsana', 'Patan', 'Other'] },
      ],
      check: (v) => {
        if (v.connection === 'No') return { ok: false, reason: 'You need an active agri electricity connection. Apply via DGVCL / UGVCL first.' };
        return { ok: true, reason: 'Scheme is being rolled out feeder-by-feeder. Check status at your DISCOM office or call 1800-233-155333.' };
      },
    },
    documents: ['Electricity bill', 'Aadhaar', 'Land records'],
    apply: 'Local DISCOM (UGVCL/MGVCL/DGVCL/PGVCL) office',
  },
];

const DOMAINS = [
  { k: 'all', l: 'All', iconName: 'LayoutDashboard' },
  { k: 'health', l: 'Health', iconName: 'Hospital' },
  { k: 'water', l: 'Water', iconName: 'Droplet' },
  { k: 'roads', l: 'Roads', iconName: 'Route' },
  { k: 'urban', l: 'Urban', iconName: 'Building2' },
  { k: 'agriculture', l: 'Agri', iconName: 'Wheat' },
];

// ── Scheme Detail ─────────────────────────────────────────────────────────────
function SchemeDetail({ scheme, onBack }: { scheme: Scheme; onBack: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EligResult | null>(null);
  const set = (k: string, v: string) => setValues(p => ({ ...p, [k]: v }));
  const allFilled = scheme.eligibility.form.every(f => values[f.id]);

  return (
    <div className="space-y-4 max-w-2xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1A3260] hover:underline">
        <ArrowLeft size={14} /> Back to schemes
      </button>

      {/* Header card */}
      <div className="bg-white rounded-[16px] p-5 shadow-[0_2px_8px_rgba(14,28,47,0.08)]" style={{ borderTop: `4px solid ${scheme.color}` }}>
        <div className="flex gap-4 mb-4">
          <div className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0" style={{ background: scheme.color + '18' }}>
            <GmsIcon name={scheme.iconName} size={26} style={{ color: scheme.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <h2 className="text-[15px] font-black text-[#0E1C2F] leading-snug flex-1">{scheme.name}</h2>
              {scheme.flagship && <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[8px] font-black text-white" style={{ background: '#F4811F' }}>FLAGSHIP</span>}
            </div>
            <p className="text-[10px] font-bold mt-1 uppercase tracking-wide" style={{ color: scheme.color }}>{scheme.department}</p>
            {scheme.tagline && <p className="text-[10px] text-[#7A8FA6] italic mt-0.5">"{scheme.tagline}"</p>}
          </div>
        </div>
        {/* Benefit */}
        <div className="rounded-[10px] p-3 mb-3" style={{ background: scheme.color + '12' }}>
          <p className="text-[9px] font-black tracking-wider mb-1" style={{ color: scheme.color }}>BENEFIT</p>
          <p className="text-[13px] font-bold text-[#0E1C2F] leading-snug">{scheme.benefit}</p>
          <p className="text-[10px] text-[#7A8FA6] mt-0.5">{scheme.benefitGu}</p>
        </div>
        <p className="text-[11px] text-[#3D5068] leading-relaxed">{scheme.summary}</p>
      </div>

      {/* Eligibility + checker */}
      <div className="bg-white rounded-[16px] p-5 shadow-[0_2px_8px_rgba(14,28,47,0.08)]">
        <h3 className="text-[13px] font-bold text-[#0E1C2F] flex items-center gap-1.5 mb-3">
          <ClipboardList size={15} className="text-[#1A3260]" /> Eligibility Criteria
        </h3>
        <div className="space-y-2 mb-5">
          {scheme.eligibility.criteria.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-[#3D5068]">
              <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: scheme.color }} /> {c}
            </div>
          ))}
        </div>

        <div className="border-t border-[#F0F2F7] pt-4">
          <h4 className="text-[12px] font-bold text-[#0E1C2F] flex items-center gap-1.5 mb-3">
            <Target size={14} className="text-[#1A3260]" /> Quick Eligibility Check
          </h4>
          <div className="space-y-3">
            {scheme.eligibility.form.map(f => (
              <div key={f.id}>
                <label className="block text-[11px] font-semibold text-[#3D5068] mb-1">{f.label}</label>
                {f.type === 'select' ? (
                  <select value={values[f.id] || ''} onChange={e => set(f.id, e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F] bg-white">
                    <option value="">Select...</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="number" value={values[f.id] || ''} onChange={e => set(f.id, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] outline-none focus:border-[#F4811F]" />
                )}
              </div>
            ))}
          </div>

          <button onClick={() => setResult(scheme.eligibility.check(values))} disabled={!allFilled}
            className="w-full mt-4 py-3 rounded-[10px] text-[13px] font-bold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
            style={{ background: scheme.color }}>
            <Sparkles size={15} /> Check My Eligibility
          </button>

          {result && (
            <div className="mt-4 rounded-[12px] p-4" style={{ background: result.ok ? '#DCFCE7' : '#FEE2E2', border: `1.5px solid ${result.ok ? '#16A34A' : '#DC2626'}` }}>
              <div className="text-[22px] mb-1">{result.ok ? '✅' : '❌'}</div>
              <p className="text-[14px] font-black mb-1" style={{ color: result.ok ? '#16A34A' : '#DC2626' }}>
                {result.ok ? 'You qualify!' : 'Not eligible'}
              </p>
              <p className="text-[11px] text-[#3D5068] leading-relaxed">{result.reason}</p>
              {result.ok && (
                <button className="mt-3 px-4 py-2 rounded-[8px] text-[11px] font-bold text-white" style={{ background: '#16A34A' }}>
                  Start Application →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Documents + Apply */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgba(14,28,47,0.08)]">
          <h4 className="text-[12px] font-bold text-[#0E1C2F] flex items-center gap-1.5 mb-3">
            <FileText size={13} className="text-[#1A3260]" /> Required Documents
          </h4>
          <div className="space-y-1.5">
            {scheme.documents.map(d => (
              <p key={d} className="text-[11px] text-[#3D5068] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: scheme.color }} /> {d}
              </p>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[14px] p-4 shadow-[0_2px_8px_rgba(14,28,47,0.08)]">
          <h4 className="text-[12px] font-bold text-[#0E1C2F] flex items-center gap-1.5 mb-3">
            <MapPin size={13} className="text-[#1A3260]" /> Where to Apply
          </h4>
          <p className="text-[11px] text-[#3D5068] leading-relaxed">{scheme.apply}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main List Page ────────────────────────────────────────────────────────────
export default function SchemesPage() {
  const [domain, setDomain] = useState('all');
  const [active, setActive] = useState<Scheme | null>(null);

  const filtered = domain === 'all' ? SCHEMES : SCHEMES.filter(s => s.domain === domain);

  if (active) return <SchemeDetail scheme={active} onBack={() => setActive(null)} />;

  return (
    <div className="space-y-4">
      {/* Hero banner */}
      <div className="rounded-[16px] px-6 py-5 text-white" style={{ background: 'linear-gradient(135deg, #1A3260 0%, #0F1A2E 100%)' }}>
        <div className="flex items-center gap-2 mb-1">
          <GmsIcon name="Building2" size={16} className="text-white/80" />
          <h1 className="text-[18px] font-black">Citizen Schemes & Services</h1>
        </div>
        <p className="text-[12px] text-white/70">{SCHEMES.length} active schemes across 5 domains · Real-time eligibility checker</p>
        <p className="text-[11px] text-white/50 mt-0.5">નાગરિક યોજનાઓ અને સેવાઓ</p>
      </div>

      {/* Domain filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DOMAINS.map(d => {
          const isActive = domain === d.k;
          return (
            <button key={d.k} onClick={() => setDomain(d.k)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold flex-shrink-0 transition-all"
              style={{ background: isActive ? '#1A3260' : '#fff', color: isActive ? '#fff' : '#3D5068', border: isActive ? 'none' : '1.5px solid #DDE3EE' }}>
              <GmsIcon name={d.iconName} size={12} />
              {d.l}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[#7A8FA6]">{filtered.length} scheme{filtered.length !== 1 ? 's' : ''} available</p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(s => (
          <button key={s.id} onClick={() => setActive(s)}
            className="bg-white rounded-[14px] p-4 text-left transition-shadow hover:shadow-md"
            style={{ border: `1.5px solid ${s.color}22`, borderLeft: `4px solid ${s.color}`, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: s.color + '18' }}>
                <GmsIcon name={s.iconName} size={18} style={{ color: s.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className="text-[12px] font-black text-[#0E1C2F] leading-snug flex-1">{s.name}</p>
                  {s.flagship && <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full text-[8px] font-black text-white" style={{ background: '#F4811F' }}>FLAGSHIP</span>}
                </div>
                <p className="text-[9px] font-bold mt-0.5 uppercase tracking-wide" style={{ color: s.color }}>{s.department}</p>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-[#3D5068] leading-snug mb-3">{s.benefit}</p>
            <p className="text-[10px] font-bold" style={{ color: '#1A3260' }}>Check eligibility →</p>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[12px] text-[#7A8FA6]">No schemes found for this domain.</div>
      )}
    </div>
  );
}
