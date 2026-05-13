// Phase 3 — Schemes & Services Master with Eligibility Configuration
window.GMS = window.GMS || {};

window.GMS.SCHEMES_MASTER = [
  {
    id: 'SCH-001',
    name: 'Pradhan Mantri Jan Arogya Yojana (PMJAY)',
    nameGu: 'પ્રધાનમંત્રી જન આરોગ્ય યોજના',
    domain: 'HEALTH',
    description: 'Health insurance scheme for poor families',
    descriptionGu: 'નબળા પરિવારો માટે આરોગ્ય બીમા યોજના',
    iconName: 'heart',
    coverage: '₹5 lakhs per family per year',
    eligibility: {
      incomeLimit: 300000,
      familySize: 'Any',
      age: 'All ages',
      caste: 'All',
      criteria: [
        { field: 'Annual Income', operator: '<', value: 300000, label: 'Annual income < ₹3 lakhs' },
        { field: 'BPL Status', operator: '==', value: true, label: 'BPL certificate holder' },
      ]
    },
    documents: ['Aadhaar', 'Income Certificate', 'BPL Certificate', 'Bank Account'],
    contact: 'CDHO, District Hospital',
  },
  {
    id: 'SCH-002',
    name: 'Jal Jeevan Mission (Water Supply)',
    nameGu: 'જલ જીવન મિશન',
    domain: 'WATER',
    description: 'Piped water supply to every household',
    descriptionGu: 'દરેક ઘર સુધી પાણીનો પુરવઠો',
    iconName: 'droplet',
    coverage: '24/7 safe drinking water',
    eligibility: {
      residenceType: 'Rural',
      waterAccess: 'No piped water',
      criteria: [
        { field: 'Location', operator: '==', value: 'Rural', label: 'Rural area' },
        { field: 'Current Water Source', operator: 'in', value: ['Hand pump', 'Well', 'Tanker'], label: 'No piped water connection' },
      ]
    },
    documents: ['Proof of Residence', 'Land ownership document', 'Photo ID'],
    contact: 'Water Supply Division, Taluka Office',
  },
  {
    id: 'SCH-003',
    name: 'Pradhan Mantri Gram Sadak Yojana (PMGSY)',
    nameGu: 'ગ્રામ સડક યોજના',
    domain: 'ROADS',
    description: 'Rural road construction & maintenance',
    descriptionGu: 'ગ્રામીણ રોડ બાંધકામ અને જંગાણ',
    iconName: 'road',
    coverage: 'All-weather roads to villages',
    eligibility: {
      population: 'Any',
      connectivity: 'No all-weather road',
      criteria: [
        { field: 'Village Population', operator: '>', value: 500, label: 'Village population > 500' },
        { field: 'Road Condition', operator: 'in', value: ['Kutcha', 'Partially paved'], label: 'No all-weather road' },
      ]
    },
    documents: ['Village list', 'Road survey report', 'Photos'],
    contact: 'PWD, District Office',
  },
  {
    id: 'SCH-004',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    nameGu: 'પ્રધાનમંત્રી આવાસ યોજના',
    domain: 'URBAN',
    description: 'Affordable housing for urban poor',
    descriptionGu: 'શહેરી ગરીબો માટે સસ્તું હોઉસિંગ',
    iconName: 'home',
    coverage: 'Subsidized housing loans',
    eligibility: {
      incomeLimit: 600000,
      homeownership: false,
      criteria: [
        { field: 'Annual Income', operator: '<', value: 600000, label: 'Annual income < ₹6 lakhs' },
        { field: 'Home Ownership', operator: '==', value: false, label: 'Does not own a house' },
        { field: 'Gender', operator: 'in', value: ['Female', 'Any'], label: 'Female beneficiary (preference)' },
      ]
    },
    documents: ['Aadhaar', 'Income Certificate', 'No Home Ownership Certificate', 'Bank Account details'],
    contact: 'Urban Development Office',
  },
  {
    id: 'SCH-005',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    nameGu: 'પ્રધાનમંત્રી ફસલ બીમા યોજના',
    domain: 'AGRICULTURE',
    description: 'Crop insurance for farmers',
    descriptionGu: 'ખેડૂતો માટે ફસલ બીમો',
    iconName: 'leaf',
    coverage: 'Crop loss compensation up to 100%',
    eligibility: {
      occupation: 'Farmer',
      landSize: 'Any',
      criteria: [
        { field: 'Land Records', operator: 'exists', value: true, label: 'Own agricultural land records' },
        { field: 'Crop Type', operator: 'in', value: ['Cotton', 'Wheat', 'Rice', 'Sugarcane'], label: 'Notified crop' },
      ]
    },
    documents: ['Land ownership', 'Crop receipt', 'Bank account', 'Photo ID'],
    contact: 'District Agriculture Office',
  },
];

window.GMS.ELIGIBILITY_RULES = {
  incomeVerification: {
    method: 'Self Declaration + e-Gram Certificate',
    timeframe: '7 days',
    verification: 'Village officer + District Finance'
  },
  documentVerification: {
    method: 'Document submission + physical verification',
    timeframe: '14 days',
    verification: 'Department head'
  },
  siteVisit: {
    method: 'Officer inspection for housing/infrastructure schemes',
    timeframe: '10 days',
    verification: 'Taluka officer'
  }
};

window.GMS.SCHEME_RESULTS_CACHE = {};

// Eligibility checker function
window.GMS.checkSchemeEligibility = function(citizenData, schemeId) {
  const scheme = window.GMS.SCHEMES_MASTER.find(s => s.id === schemeId);
  if (!scheme) return { eligible: false, reason: 'Scheme not found' };

  const results = {
    schemeId,
    schemeName: scheme.name,
    eligible: true,
    checks: [],
    missingDocuments: [],
    estimatedApprovalTime: '14-21 days',
  };

  // Check each eligibility criterion
  (scheme.eligibility.criteria || []).forEach(criterion => {
    const citizenValue = citizenData[criterion.field];
    let passed = false;

    if (criterion.operator === '<') {
      passed = citizenValue < criterion.value;
    } else if (criterion.operator === '>') {
      passed = citizenValue > criterion.value;
    } else if (criterion.operator === '==') {
      passed = citizenValue === criterion.value;
    } else if (criterion.operator === 'in') {
      passed = criterion.value.includes(citizenValue);
    } else if (criterion.operator === 'exists') {
      passed = !!citizenValue;
    }

    results.checks.push({
      criterion: criterion.label,
      passed,
      status: passed ? 'PASS' : 'FAIL'
    });

    if (!passed) results.eligible = false;
  });

  // Check for missing documents
  (scheme.documents || []).forEach(doc => {
    if (!citizenData.documents?.includes(doc)) {
      results.missingDocuments.push(doc);
      results.eligible = false;
    }
  });

  // Calculate approval timeline
  if (results.eligible) {
    results.status = 'ELIGIBLE';
    results.nextSteps = [
      '1. Submit application with documents',
      `2. Verification (${window.GMS.ELIGIBILITY_RULES.documentVerification.timeframe})`,
      `3. Approval (${window.GMS.ELIGIBILITY_RULES.documentVerification.timeframe})`,
      '4. Benefit disbursement'
    ];
  } else {
    results.status = 'NOT ELIGIBLE';
    results.nextSteps = ['Address eligibility gaps', 'Reapply after meeting criteria'];
  }

  return results;
};

// Bulk eligibility check across all schemes
window.GMS.checkAllSchemeEligibility = function(citizenData) {
  return window.GMS.SCHEMES_MASTER.map(scheme => {
    const result = window.GMS.checkSchemeEligibility(citizenData, scheme.id);
    return {
      ...result,
      iconName: scheme.iconName,
      coverage: scheme.coverage,
      contact: scheme.contact
    };
  }).filter(r => r.eligible);
};
