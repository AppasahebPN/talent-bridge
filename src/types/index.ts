export type Role = "employee" | "hr" | "committee";

export interface CompetencyScore {
  name: string;
  score: number;
}

export interface Training {
  id: string;
  name: string;
  provider: string;
  hours: number;
  category: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  scale: string;
  domain: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  region: string;
  expertise: string[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  detail: string;
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  region: string;
  currentRole: string;
  grade: string;
  experience: number;
  yearsInOrg: number;
  photo: string;
  email: string;
  performance: { year: string; rating: number }[];
  assessmentScore: number;
  nineBox: { performance: number; potential: number };
  competencies: CompetencyScore[];
  trainings: { id: string; completedOn: string }[];
  projects: string[];
  certifications: string[];
  mentorId: string | null;
  timeline: TimelineEvent[];
  highPotential: boolean;
  readiness: "Ready Now" | "Ready 1-2 Yrs" | "Ready 3-5 Yrs" | "Development Needed";
  targetRoleId: string;
  idpProgress: number;
}

export interface SuccessProfile {
  id: string;
  title: string;
  grade: string;
  band: string;
  summary: string;
  competencies: CompetencyScore[];
  experience: string[];
  projects: string[];
  certifications: string[];
  geographicExposure: string[];
  functionalExposure: string[];
  openings: number;
  incumbent: string;
}

export interface IdpActivity {
  id: string;
  title: string;
  type: "Training" | "Rotation" | "Project" | "Mentoring" | "Coaching";
  detail: string;
  priority: "Critical" | "High" | "Medium";
  quarter: string;
  status: "Completed" | "In Progress" | "Pending";
  impact: number;
}
