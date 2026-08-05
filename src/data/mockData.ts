import type {
  Employee,
  IdpActivity,
  Mentor,
  ProjectItem,
  SuccessProfile,
  Training,
} from "@/types";

export const COMPETENCIES = [
  "Leadership",
  "Communication",
  "Technical Expertise",
  "Financial Knowledge",
  "Project Management",
  "People Management",
  "Strategic Thinking",
];

export const DEPARTMENTS = [
  "Transmission",
  "Operations & Maintenance",
  "Engineering",
  "Finance",
  "Human Resources",
  "IT & Telecom",
  "Corporate Planning",
];

export const REGIONS = [
  "Northern Region",
  "Western Region",
  "Southern Region",
  "Eastern Region",
  "North-Eastern Region",
  "Corporate Centre",
];

export const trainings: Training[] = [
  { id: "T01", name: "Advanced Leadership Excellence", provider: "IIM Ahmedabad", hours: 40, category: "Leadership" },
  { id: "T02", name: "Strategic Decision Making", provider: "ISB Hyderabad", hours: 32, category: "Strategy" },
  { id: "T03", name: "Financial Management for Executives", provider: "NPTI", hours: 24, category: "Finance" },
  { id: "T04", name: "EHV Substation Design", provider: "CPRI", hours: 48, category: "Technical" },
  { id: "T05", name: "Smart Grid & SCADA Systems", provider: "POWERGRID Academy", hours: 36, category: "Technical" },
  { id: "T06", name: "Project Risk Management (PMP Prep)", provider: "PMI India", hours: 40, category: "Projects" },
  { id: "T07", name: "Stakeholder & Regulatory Management", provider: "CERC Institute", hours: 20, category: "Governance" },
  { id: "T08", name: "Negotiation & Influence", provider: "XLRI Jamshedpur", hours: 16, category: "Leadership" },
  { id: "T09", name: "Digital Transformation in Utilities", provider: "TCS iON", hours: 28, category: "Digital" },
  { id: "T10", name: "Cyber Security for Critical Infrastructure", provider: "CERT-In", hours: 24, category: "Digital" },
  { id: "T11", name: "Contract & Tender Administration", provider: "IIM Lucknow", hours: 24, category: "Commercial" },
  { id: "T12", name: "Executive Communication & Media Handling", provider: "MICA", hours: 16, category: "Communication" },
  { id: "T13", name: "HVDC Systems Advanced", provider: "CPRI", hours: 44, category: "Technical" },
  { id: "T14", name: "Talent & Succession Management", provider: "SHRM India", hours: 20, category: "HR" },
  { id: "T15", name: "Data-Driven Asset Management", provider: "POWERGRID Academy", hours: 30, category: "Digital" },
  { id: "T16", name: "Environment, Safety & Sustainability", provider: "TERI", hours: 18, category: "Governance" },
  { id: "T17", name: "Global Utility Benchmarking Programme", provider: "CIGRE", hours: 40, category: "Strategy" },
  { id: "T18", name: "Coaching & Mentoring Skills", provider: "ICF India", hours: 24, category: "Leadership" },
  { id: "T19", name: "Advanced Power System Protection", provider: "NPTI", hours: 36, category: "Technical" },
  { id: "T20", name: "Board Readiness & Corporate Governance", provider: "IICA", hours: 32, category: "Governance" },
];

export const projects: ProjectItem[] = [
  { id: "P01", name: "765kV Transmission Corridor - Phase III", scale: "Mega (>₹2000 Cr)", domain: "Transmission" },
  { id: "P02", name: "HVDC Bipole Link Commissioning", scale: "Mega (>₹2000 Cr)", domain: "HVDC" },
  { id: "P03", name: "Green Energy Corridor Integration", scale: "Large (₹500-2000 Cr)", domain: "Renewables" },
  { id: "P04", name: "National Load Despatch Modernisation", scale: "Large (₹500-2000 Cr)", domain: "Grid Operations" },
  { id: "P05", name: "Substation Automation Rollout", scale: "Medium (₹100-500 Cr)", domain: "Automation" },
  { id: "P06", name: "Enterprise ERP Transformation", scale: "Large (₹500-2000 Cr)", domain: "IT" },
  { id: "P07", name: "Cross-Border Interconnection (Nepal)", scale: "Large (₹500-2000 Cr)", domain: "International" },
  { id: "P08", name: "Smart Metering Deployment", scale: "Medium (₹100-500 Cr)", domain: "Distribution" },
  { id: "P09", name: "Grid Cyber Resilience Programme", scale: "Medium (₹100-500 Cr)", domain: "Cyber" },
  { id: "P10", name: "Asset Life Extension Initiative", scale: "Medium (₹100-500 Cr)", domain: "O&M" },
  { id: "P11", name: "Solar Park Evacuation Scheme", scale: "Large (₹500-2000 Cr)", domain: "Renewables" },
  { id: "P12", name: "Telecom Backbone Expansion", scale: "Medium (₹100-500 Cr)", domain: "Telecom" },
  { id: "P13", name: "Regional Disaster Recovery Programme", scale: "Medium (₹100-500 Cr)", domain: "Resilience" },
  { id: "P14", name: "Battery Energy Storage Pilot", scale: "Medium (₹100-500 Cr)", domain: "Storage" },
  { id: "P15", name: "Tariff Restructuring & Regulatory Filing", scale: "Strategic", domain: "Finance" },
];

export const mentors: Mentor[] = [
  { id: "M01", name: "Dr. Anil Raghavan", role: "Director (Operations)", region: "Corporate Centre", expertise: ["Grid Operations", "Leadership"] },
  { id: "M02", name: "Sunita Deshmukh", role: "Executive Director (Finance)", region: "Corporate Centre", expertise: ["Financial Strategy", "Governance"] },
  { id: "M03", name: "Rakesh Menon", role: "Regional Executive Director", region: "Western Region", expertise: ["Transmission", "Stakeholder Management"] },
  { id: "M04", name: "Meera Krishnan", role: "Chief General Manager (HR)", region: "Corporate Centre", expertise: ["Talent Management", "Coaching"] },
  { id: "M05", name: "Vikram Chauhan", role: "Chief General Manager (HVDC)", region: "Northern Region", expertise: ["HVDC", "Project Delivery"] },
  { id: "M06", name: "Alok Bhattacharya", role: "Executive Director (Projects)", region: "Eastern Region", expertise: ["Mega Projects", "Contracts"] },
  { id: "M07", name: "Priya Nair", role: "Chief General Manager (IT)", region: "Southern Region", expertise: ["Digital Transformation", "Cyber"] },
  { id: "M08", name: "Harjeet Singh Gill", role: "Executive Director (O&M)", region: "Northern Region", expertise: ["Asset Management", "Safety"] },
  { id: "M09", name: "Lakshmi Venkatesh", role: "Chief General Manager (Planning)", region: "Corporate Centre", expertise: ["Corporate Strategy", "Regulatory"] },
  { id: "M10", name: "Debashish Sarkar", role: "Regional Executive Director", region: "North-Eastern Region", expertise: ["Regional Operations", "Community Relations"] },
];

export const successProfiles: SuccessProfile[] = [
  {
    id: "SP01",
    title: "Regional Executive Director",
    grade: "E8",
    band: "Senior Leadership",
    summary:
      "Owns end-to-end transmission performance, safety and stakeholder outcomes for a region with multi-thousand crore asset base.",
    competencies: [
      { name: "Leadership", score: 90 },
      { name: "Financial Knowledge", score: 80 },
      { name: "Technical Expertise", score: 85 },
      { name: "Communication", score: 88 },
      { name: "Project Management", score: 82 },
      { name: "People Management", score: 86 },
      { name: "Strategic Thinking", score: 92 },
    ],
    experience: ["20+ years in power sector", "8+ years in E7 grade or above", "5+ years P&L / regional accountability"],
    projects: ["Mega transmission project (>₹2000 Cr)", "Grid operations transformation", "Regulatory / tariff engagement"],
    certifications: ["Advanced Leadership Programme (IIM/ISB)", "PMP or equivalent", "Board Readiness Programme"],
    geographicExposure: ["Minimum 2 regions", "1 remote / difficult terrain posting"],
    functionalExposure: ["Operations & Maintenance", "Projects", "Finance or Commercial"],
    openings: 2,
    incumbent: "R. Sundaram (retiring Mar 2027)",
  },
  {
    id: "SP02",
    title: "Executive Director (Projects)",
    grade: "E8",
    band: "Senior Leadership",
    summary: "Accountable for national project portfolio delivery, contracting strategy and capital productivity.",
    competencies: [
      { name: "Leadership", score: 85 },
      { name: "Financial Knowledge", score: 82 },
      { name: "Technical Expertise", score: 88 },
      { name: "Communication", score: 80 },
      { name: "Project Management", score: 95 },
      { name: "People Management", score: 80 },
      { name: "Strategic Thinking", score: 85 },
    ],
    experience: ["18+ years, 10 in project delivery", "Managed portfolio > ₹5000 Cr"],
    projects: ["Two mega projects as lead", "EPC contract restructuring"],
    certifications: ["PMP / PgMP", "Contract Management Certification"],
    geographicExposure: ["Minimum 2 regions", "1 cross-border or international assignment"],
    functionalExposure: ["Projects", "Contracts & Materials", "Engineering"],
    openings: 1,
    incumbent: "A. Bhattacharya",
  },
  {
    id: "SP03",
    title: "Chief General Manager (Operations)",
    grade: "E7",
    band: "Senior Management",
    summary: "Leads grid availability, outage planning and asset reliability across a region.",
    competencies: [
      { name: "Leadership", score: 82 },
      { name: "Financial Knowledge", score: 70 },
      { name: "Technical Expertise", score: 92 },
      { name: "Communication", score: 78 },
      { name: "Project Management", score: 78 },
      { name: "People Management", score: 84 },
      { name: "Strategic Thinking", score: 78 },
    ],
    experience: ["15+ years, 6 in O&M leadership", "Substation & line asset ownership"],
    projects: ["Asset life extension", "Substation automation rollout"],
    certifications: ["Advanced Power System Protection", "Safety Leadership Certification"],
    geographicExposure: ["Minimum 2 regions"],
    functionalExposure: ["Operations & Maintenance", "Grid Management"],
    openings: 3,
    incumbent: "Multiple",
  },
  {
    id: "SP04",
    title: "Chief General Manager (Finance)",
    grade: "E7",
    band: "Senior Management",
    summary: "Owns regional financial control, tariff filings, and capital allocation discipline.",
    competencies: [
      { name: "Leadership", score: 80 },
      { name: "Financial Knowledge", score: 95 },
      { name: "Technical Expertise", score: 62 },
      { name: "Communication", score: 82 },
      { name: "Project Management", score: 72 },
      { name: "People Management", score: 78 },
      { name: "Strategic Thinking", score: 86 },
    ],
    experience: ["15+ years in finance", "Regulatory filing ownership"],
    projects: ["Tariff restructuring", "ERP finance transformation"],
    certifications: ["CA / ICWA / MBA Finance", "IFRS Certification"],
    geographicExposure: ["Corporate Centre + 1 region"],
    functionalExposure: ["Finance", "Regulatory", "Commercial"],
    openings: 1,
    incumbent: "S. Deshmukh",
  },
  {
    id: "SP05",
    title: "Chief General Manager (HVDC)",
    grade: "E7",
    band: "Senior Management",
    summary: "Technical authority for HVDC assets, commissioning and specialised O&M capability.",
    competencies: [
      { name: "Leadership", score: 78 },
      { name: "Financial Knowledge", score: 65 },
      { name: "Technical Expertise", score: 96 },
      { name: "Communication", score: 74 },
      { name: "Project Management", score: 85 },
      { name: "People Management", score: 76 },
      { name: "Strategic Thinking", score: 76 },
    ],
    experience: ["14+ years, 5 in HVDC/FACTS"],
    projects: ["HVDC bipole commissioning", "Converter station upgrade"],
    certifications: ["HVDC Systems Advanced (CPRI)", "CIGRE Working Group participation"],
    geographicExposure: ["1 HVDC terminal posting"],
    functionalExposure: ["Engineering", "O&M"],
    openings: 1,
    incumbent: "V. Chauhan",
  },
  {
    id: "SP06",
    title: "Chief General Manager (Human Resources)",
    grade: "E7",
    band: "Senior Management",
    summary: "Leads talent, succession, industrial relations and capability building agenda.",
    competencies: [
      { name: "Leadership", score: 85 },
      { name: "Financial Knowledge", score: 66 },
      { name: "Technical Expertise", score: 58 },
      { name: "Communication", score: 92 },
      { name: "Project Management", score: 72 },
      { name: "People Management", score: 95 },
      { name: "Strategic Thinking", score: 84 },
    ],
    experience: ["15+ years HR", "IR handling at plant/region"],
    projects: ["Succession framework rollout", "Competency architecture design"],
    certifications: ["SHRM-SCP", "Coaching Certification (ICF)"],
    geographicExposure: ["Corporate Centre + 1 region"],
    functionalExposure: ["HR", "Learning & Development"],
    openings: 1,
    incumbent: "M. Krishnan",
  },
  {
    id: "SP07",
    title: "General Manager (Transmission Projects)",
    grade: "E6",
    band: "Middle Leadership",
    summary: "Delivers transmission line and substation packages to cost, quality and schedule.",
    competencies: [
      { name: "Leadership", score: 74 },
      { name: "Financial Knowledge", score: 70 },
      { name: "Technical Expertise", score: 86 },
      { name: "Communication", score: 74 },
      { name: "Project Management", score: 90 },
      { name: "People Management", score: 74 },
      { name: "Strategic Thinking", score: 70 },
    ],
    experience: ["12+ years, 5 in project execution"],
    projects: ["Two large packages as package head"],
    certifications: ["PMP", "Quality & Safety Audit"],
    geographicExposure: ["2 project sites"],
    functionalExposure: ["Projects", "Engineering"],
    openings: 4,
    incumbent: "Multiple",
  },
  {
    id: "SP08",
    title: "General Manager (IT & Digital)",
    grade: "E6",
    band: "Middle Leadership",
    summary: "Drives digital platforms, cyber posture and analytics adoption across the enterprise.",
    competencies: [
      { name: "Leadership", score: 76 },
      { name: "Financial Knowledge", score: 68 },
      { name: "Technical Expertise", score: 90 },
      { name: "Communication", score: 78 },
      { name: "Project Management", score: 84 },
      { name: "People Management", score: 72 },
      { name: "Strategic Thinking", score: 82 },
    ],
    experience: ["12+ years IT, 4 in utility domain"],
    projects: ["ERP transformation", "Cyber resilience programme"],
    certifications: ["CISSP or CISM", "Cloud Architect Certification"],
    geographicExposure: ["Corporate Centre"],
    functionalExposure: ["IT & Telecom", "Operations interface"],
    openings: 2,
    incumbent: "P. Nair",
  },
  {
    id: "SP09",
    title: "General Manager (Corporate Planning)",
    grade: "E6",
    band: "Middle Leadership",
    summary: "Shapes long-range capacity plans, business cases and diversification strategy.",
    competencies: [
      { name: "Leadership", score: 76 },
      { name: "Financial Knowledge", score: 86 },
      { name: "Technical Expertise", score: 72 },
      { name: "Communication", score: 84 },
      { name: "Project Management", score: 72 },
      { name: "People Management", score: 70 },
      { name: "Strategic Thinking", score: 94 },
    ],
    experience: ["12+ years, 4 in planning/strategy"],
    projects: ["National perspective plan", "Diversification business case"],
    certifications: ["Strategy Programme (ISB/IIM)", "Financial Modelling"],
    geographicExposure: ["Corporate Centre + 1 region"],
    functionalExposure: ["Planning", "Finance", "Regulatory"],
    openings: 1,
    incumbent: "L. Venkatesh",
  },
  {
    id: "SP10",
    title: "Deputy General Manager (Grid Operations)",
    grade: "E5",
    band: "Middle Leadership",
    summary: "Runs real-time grid control desk operations and outage coordination.",
    competencies: [
      { name: "Leadership", score: 68 },
      { name: "Financial Knowledge", score: 58 },
      { name: "Technical Expertise", score: 88 },
      { name: "Communication", score: 76 },
      { name: "Project Management", score: 66 },
      { name: "People Management", score: 68 },
      { name: "Strategic Thinking", score: 64 },
    ],
    experience: ["10+ years, 4 in load despatch"],
    projects: ["Load despatch modernisation", "SCADA upgrade"],
    certifications: ["SCADA & Smart Grid", "System Operator Certification"],
    geographicExposure: ["1 regional load despatch centre"],
    functionalExposure: ["Grid Operations"],
    openings: 5,
    incumbent: "Multiple",
  },
];

const FIRST = [
  "Arjun", "Kavita", "Rohit", "Neha", "Sandeep", "Ananya", "Vivek", "Pooja", "Manish", "Shruti",
  "Karthik", "Deepa", "Rajesh", "Swati", "Nitin", "Ritu", "Suresh", "Aarti", "Gaurav", "Sneha",
  "Prakash", "Divya", "Mohit", "Ishita", "Ravi", "Tanvi", "Ashok", "Nandini", "Yogesh", "Farhan",
];
const LAST = [
  "Sharma", "Iyer", "Verma", "Kapoor", "Reddy", "Ghosh", "Patil", "Chatterjee", "Malhotra", "Nair",
  "Subramanian", "Joshi", "Kulkarni", "Bose", "Rathore", "Bhagat", "Menon", "Saxena", "Pillai", "Trivedi",
  "Mishra", "Rao", "Agarwal", "Banerjee", "Kaur", "Desai", "Chandra", "Sethi", "Dubey", "Qureshi",
];

const ROLE_BY_GRADE: Record<string, string[]> = {
  E7: ["Chief General Manager (Operations)", "Chief General Manager (Projects)", "Chief General Manager (Finance)"],
  E6: ["General Manager (Transmission)", "General Manager (IT & Digital)", "General Manager (Corporate Planning)"],
  E5: ["Deputy General Manager (Grid Operations)", "Deputy General Manager (Substations)", "Deputy General Manager (HR)"],
  E4: ["Senior Manager (Engineering)", "Senior Manager (Contracts)", "Senior Manager (Finance)"],
};

function seeded(i: number, salt: number) {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildEmployee(i: number): Employee {
  const grades = ["E7", "E6", "E6", "E5", "E5", "E4"];
  const grade = grades[i % grades.length];
  const roleList = ROLE_BY_GRADE[grade];
  const currentRole = roleList[i % roleList.length];
  const department = DEPARTMENTS[i % DEPARTMENTS.length];
  const region = REGIONS[(i * 3) % REGIONS.length];
  const base = 55 + Math.floor(seeded(i, 1) * 35);
  const competencies = COMPETENCIES.map((name, ci) => ({
    name,
    score: Math.max(38, Math.min(97, base + Math.floor(seeded(i, ci + 2) * 26) - 12)),
  }));
  const avg = Math.round(competencies.reduce((s, c) => s + c.score, 0) / competencies.length);
  const performance = ["2021", "2022", "2023", "2024", "2025"].map((year, yi) => ({
    year,
    rating: Math.round((3 + seeded(i, yi + 20) * 2) * 10) / 10,
  }));
  const assessmentScore = Math.max(45, Math.min(96, avg + Math.floor(seeded(i, 9) * 12) - 6));
  const perfScore = Math.round(((performance[4].rating - 1) / 4) * 100);
  const potential = Math.round((avg + assessmentScore) / 2);
  const readiness: Employee["readiness"] =
    avg >= 82 && perfScore >= 75 ? "Ready Now" : avg >= 72 ? "Ready 1-2 Yrs" : avg >= 62 ? "Ready 3-5 Yrs" : "Development Needed";
  const experience = 10 + (i % 18);
  const targets = ["SP01", "SP02", "SP03", "SP04", "SP05", "SP06", "SP07", "SP08", "SP09", "SP10"];

  return {
    id: `E${String(i + 1).padStart(3, "0")}`,
    name: `${FIRST[i]} ${LAST[i]}`,
    employeeId: `PG${20000 + i * 37}`,
    department,
    region,
    currentRole,
    grade,
    experience,
    yearsInOrg: Math.max(4, experience - (i % 6)),
    photo: `https://i.pravatar.cc/240?img=${(i % 70) + 1}`,
    email: `${FIRST[i].toLowerCase()}.${LAST[i].toLowerCase()}@powergrid.in`,
    performance,
    assessmentScore,
    nineBox: { performance: perfScore, potential },
    competencies,
    trainings: [0, 1, 2, 3].map((k) => ({
      id: trainings[(i + k * 5) % trainings.length].id,
      completedOn: `${2021 + (k % 4)}-0${(k % 8) + 1}-1${k}`,
    })),
    projects: [0, 1, 2].map((k) => projects[(i * 2 + k) % projects.length].id),
    certifications: [
      "ISO 9001 Lead Auditor",
      "PMP - Project Management Professional",
      "Six Sigma Green Belt",
      "Certified Energy Manager",
      "SHRM-CP",
    ].filter((_, ci) => (i + ci) % 3 !== 0),
    mentorId: mentors[i % mentors.length].id,
    timeline: [
      { year: `${2026 - experience}`, title: "Joined POWERGRID as Executive Trainee", detail: `${department} · ${REGIONS[i % REGIONS.length]}` },
      { year: `${2026 - experience + 5}`, title: "Promoted to Manager (E3)", detail: "Substation commissioning ownership" },
      { year: `${2026 - Math.max(4, experience - 8)}`, title: "Cross-region transfer", detail: `Moved to ${region}` },
      { year: `${2026 - 3}`, title: `Elevated to ${grade}`, detail: currentRole },
      { year: "2025", title: "Assessment Centre completed", detail: `Score ${assessmentScore}/100` },
    ],
    highPotential: potential >= 78 && perfScore >= 70,
    readiness,
    targetRoleId: targets[i % targets.length],
    idpProgress: 20 + Math.floor(seeded(i, 31) * 70),
  };
}

export const employees: Employee[] = Array.from({ length: 30 }, (_, i) => buildEmployee(i));

export function getEmployee(id: string) {
  return employees.find((e) => e.id === id);
}

export function getProfile(id: string) {
  return successProfiles.find((p) => p.id === id);
}

export function getMentor(id: string | null) {
  return mentors.find((m) => m.id === id);
}

export function getTraining(id: string) {
  return trainings.find((t) => t.id === id);
}

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export function buildIdp(employeeId: string): IdpActivity[] {
  const emp = getEmployee(employeeId);
  const profile = emp ? getProfile(emp.targetRoleId) : undefined;
  if (!emp || !profile) return [];
  const gaps = profile.competencies
    .map((c) => ({ name: c.name, gap: c.score - (emp.competencies.find((e) => e.name === c.name)?.score ?? 0) }))
    .filter((g) => g.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  const quarters = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"];
  const statusFor = (idx: number): IdpActivity["status"] =>
    emp.idpProgress > (idx + 1) * 18 ? "Completed" : emp.idpProgress > idx * 18 ? "In Progress" : "Pending";

  const primaryGap = gaps[0]?.name ?? "Leadership";
  const secondaryGap = gaps[1]?.name ?? "Strategic Thinking";

  const plan: IdpActivity[] = [
    {
      id: "A1",
      title: trainings.find((t) => t.category === "Leadership")!.name,
      type: "Training",
      detail: `Closes the ${primaryGap} gap of ${gaps[0]?.gap ?? 8} points identified against ${profile.title}.`,
      priority: "Critical",
      quarter: quarters[0],
      status: statusFor(0),
      impact: 8,
    },
    {
      id: "A2",
      title: `Job Rotation — ${profile.functionalExposure[0]}`,
      type: "Rotation",
      detail: `6-month rotation to build required functional exposure in ${profile.functionalExposure.join(", ")}.`,
      priority: "High",
      quarter: quarters[1],
      status: statusFor(1),
      impact: 7,
    },
    {
      id: "A3",
      title: `Lead role on ${profile.projects[0]}`,
      type: "Project",
      detail: "Stretch assignment giving measurable delivery accountability at target scale.",
      priority: "Critical",
      quarter: quarters[2],
      status: statusFor(2),
      impact: 9,
    },
    {
      id: "A4",
      title: `Mentoring with ${getMentor(emp.mentorId)?.name}`,
      type: "Mentoring",
      detail: `Monthly structured sessions focused on ${secondaryGap.toLowerCase()} and executive presence.`,
      priority: "Medium",
      quarter: quarters[3],
      status: statusFor(3),
      impact: 5,
    },
    {
      id: "A5",
      title: "Executive Leadership Coaching",
      type: "Coaching",
      detail: "ICF-certified coach, 8 sessions covering stakeholder influence and board-level communication.",
      priority: "High",
      quarter: quarters[4],
      status: statusFor(4),
      impact: 6,
    },
    {
      id: "A6",
      title: profile.certifications[0],
      type: "Training",
      detail: "Mandatory certification listed in the success profile for this role.",
      priority: "High",
      quarter: quarters[5],
      status: statusFor(5),
      impact: 6,
    },
  ];
  return plan;
}

export function gapAnalysis(employeeId: string, profileId: string) {
  const emp = getEmployee(employeeId);
  const profile = getProfile(profileId);

  // Return safe defaults when employee or profile is not found in mock data
  if (!emp || !profile) {
    const fallbackEmp = emp ?? employees[0];
    const fallbackProfile = profile ?? successProfiles[0];
    return {
      emp: fallbackEmp,
      profile: fallbackProfile,
      rows: [] as { name: string; required: number; current: number; gap: number }[],
      readinessScore: 0,
      strengths: [] as { name: string; required: number; current: number; gap: number }[],
      weaknesses: [] as { name: string; required: number; current: number; gap: number }[],
    };
  }

  const rows = profile.competencies.map((req) => {
    const current = emp.competencies.find((c) => c.name === req.name)?.score ?? 0;
    return { name: req.name, required: req.score, current, gap: Math.max(0, req.score - current) };
  });
  const totalRequired = rows.reduce((s, r) => s + r.required, 0);
  const totalAchieved = rows.reduce((s, r) => s + Math.min(r.current, r.required), 0);
  const readinessScore = totalRequired > 0 ? Math.round((totalAchieved / totalRequired) * 100) : 0;
  const strengths = rows.filter((r) => r.current >= r.required).sort((a, b) => b.current - a.current);
  const weaknesses = rows.filter((r) => r.gap > 0).sort((a, b) => b.gap - a.gap);
  return { emp, profile, rows, readinessScore, strengths, weaknesses };
}
