export interface User {
  id: string;
  username: string;
  name: string;
  role: 'teacher' | 'college_admin' | 'academic_admin' | 'system_admin';
  college?: string;
  email: string;
  avatar?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export type PlanStatus =
  | 'draft'
  | 'submitted'
  | 'college_reviewing'
  | 'college_approved'
  | 'academic_reviewing'
  | 'final_approved'
  | 'rejected';

export interface AIEvaluation {
  id: string;
  plan_id: string;
  score: number;
  dimension_scores: {
    completeness: number;
    clarity: number;
    alignment: number;
    practicality: number;
  };
  suggestions: string[];
  strengths: string[];
  evaluated_at: string;
}

export interface TeachingPlan {
  id: string;
  title: string;
  teacher_id: string;
  teacher_name: string;
  college: string;
  course_name: string;
  content: string;
  attachments: Attachment[];
  status: PlanStatus;
  ai_evaluation?: AIEvaluation;
  created_at: string;
  updated_at: string;
}

export interface ReviewRecord {
  id: string;
  plan_id: string;
  reviewer_id: string;
  reviewer_name: string;
  stage: 'college' | 'academic';
  status: 'approved' | 'rejected';
  comment: string;
  created_at: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  college: string;
  objectives: string[];
  courses: string[];
  industry_requirements: string[];
  created_at: string;
  updated_at: string;
}

export interface CourseStandard {
  id: string;
  program_id: string;
  course_name: string;
  standards: string[];
  assessment_methods: string[];
}

export interface StatCard {
  title: string;
  value: number | string;
  change?: number;
  icon: string;
  color: string;
}
