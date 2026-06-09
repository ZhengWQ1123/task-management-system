import { create } from 'zustand';
import type { TeachingPlan, PlanStatus, AIEvaluation } from '../types';

interface PlanStore {
  plans: TeachingPlan[];
  currentPlan: TeachingPlan | null;
  isLoading: boolean;
  fetchPlans: () => Promise<void>;
  fetchPlanById: (id: string) => Promise<void>;
  createPlan: (data: Partial<TeachingPlan>) => Promise<TeachingPlan>;
  updatePlan: (id: string, data: Partial<TeachingPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  submitPlan: (id: string) => Promise<void>;
  evaluatePlan: (id: string) => Promise<AIEvaluation>;
  approvePlan: (id: string, comment: string) => Promise<void>;
  rejectPlan: (id: string, comment: string) => Promise<void>;
}

const generateId = () => `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const evaluatePlanWithAI = (plan: TeachingPlan): AIEvaluation => {
  const contentLength = plan.content.length;
  const hasObjectives = plan.content.includes('教学目标');
  const hasSchedule = plan.content.includes('教学安排') || plan.content.includes('第');
  const hasAssessment = plan.content.includes('考核');

  const completeness = Math.min(100, Math.round(
    (contentLength > 200 ? 30 : contentLength / 200 * 30) +
    (hasObjectives ? 25 : 0) +
    (hasSchedule ? 25 : 0) +
    (hasAssessment ? 20 : 0)
  ));

  const clarity = Math.min(100, Math.round(
    (contentLength > 300 ? 40 : contentLength / 300 * 40) +
    (hasObjectives && hasSchedule && hasAssessment ? 60 : 30)
  ));

  const alignment = Math.round(70 + Math.random() * 20);
  const practicality = Math.round(65 + Math.random() * 25);

  const score = Math.round(completeness * 0.3 + clarity * 0.25 + alignment * 0.25 + practicality * 0.2);

  const suggestions: string[] = [];
  const strengths: string[] = [];

  if (completeness < 80) {
    suggestions.push('建议补充更详细的教学内容描述');
  }
  if (!plan.content.includes('案例') && !plan.content.includes('实例')) {
    suggestions.push('建议增加实际案例或应用场景，帮助学生理解');
  }
  if (!plan.content.includes('实验') && !plan.content.includes('实践')) {
    suggestions.push('建议明确实践环节的具体安排');
  }

  if (hasObjectives) {
    strengths.push('教学目标描述清晰明确');
  }
  if (hasSchedule) {
    strengths.push('教学进度安排合理');
  }
  if (hasAssessment) {
    strengths.push('考核方式设置科学合理');
  }

  return {
    id: `eval-${Date.now()}`,
    plan_id: plan.id,
    score,
    dimension_scores: {
      completeness,
      clarity,
      alignment,
      practicality
    },
    suggestions,
    strengths,
    evaluated_at: new Date().toISOString()
  };
};

export const usePlanStore = create<PlanStore>((set, get) => ({
  plans: [],
  currentPlan: null,
  isLoading: false,

  fetchPlans: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));

    const stored = localStorage.getItem('plans');
    const plans = stored ? JSON.parse(stored) : getInitialPlans();

    if (!stored) {
      localStorage.setItem('plans', JSON.stringify(plans));
    }

    set({ plans, isLoading: false });
  },

  fetchPlanById: async (id: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 200));

    const plans = get().plans;
    const plan = plans.find(p => p.id === id) || null;

    set({ currentPlan: plan, isLoading: false });
  },

  createPlan: async (data: Partial<TeachingPlan>) => {
    const newPlan: TeachingPlan = {
      id: generateId(),
      title: data.title || '新建授课计划',
      teacher_id: data.teacher_id || '',
      teacher_name: data.teacher_name || '',
      college: data.college || '',
      course_name: data.course_name || '',
      content: data.content || '',
      attachments: [],
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const plans = [...get().plans, newPlan];
    localStorage.setItem('plans', JSON.stringify(plans));
    set({ plans });

    return newPlan;
  },

  updatePlan: async (id: string, data: Partial<TeachingPlan>) => {
    const plans = get().plans.map(p =>
      p.id === id
        ? { ...p, ...data, updated_at: new Date().toISOString() }
        : p
    );
    localStorage.setItem('plans', JSON.stringify(plans));
    set({ plans, currentPlan: plans.find(p => p.id === id) || null });
  },

  deletePlan: async (id: string) => {
    const plans = get().plans.filter(p => p.id !== id);
    localStorage.setItem('plans', JSON.stringify(plans));
    set({ plans });
  },

  submitPlan: async (id: string) => {
    const plans = get().plans.map(p =>
      p.id === id
        ? { ...p, status: 'submitted' as PlanStatus, updated_at: new Date().toISOString() }
        : p
    );
    localStorage.setItem('plans', JSON.stringify(plans));
    set({ plans, currentPlan: plans.find(p => p.id === id) || null });
  },

  evaluatePlan: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const plan = get().plans.find(p => p.id === id);
    if (!plan) throw new Error('Plan not found');

    const evaluation = evaluatePlanWithAI(plan);

    const plans = get().plans.map(p =>
      p.id === id
        ? { ...p, ai_evaluation: evaluation, updated_at: new Date().toISOString() }
        : p
    );
    localStorage.setItem('plans', JSON.stringify(plans));
    set({ plans, currentPlan: plans.find(p => p.id === id) || null });

    return evaluation;
  },

  approvePlan: async (id: string, _comment: string) => {
    const plan = get().plans.find(p => p.id === id);
    if (!plan) throw new Error('Plan not found');

    let newStatus: PlanStatus;
    if (plan.status === 'submitted' || plan.status === 'college_reviewing') {
      newStatus = 'college_approved';
    } else if (plan.status === 'college_approved' || plan.status === 'academic_reviewing') {
      newStatus = 'final_approved';
    } else {
      return;
    }

    const plans = get().plans.map(p =>
      p.id === id
        ? { ...p, status: newStatus, updated_at: new Date().toISOString() }
        : p
    );
    localStorage.setItem('plans', JSON.stringify(plans));
    set({ plans, currentPlan: plans.find(p => p.id === id) || null });
  },

  rejectPlan: async (id: string, _comment: string) => {
    const plans = get().plans.map(p =>
      p.id === id
        ? { ...p, status: 'rejected' as PlanStatus, updated_at: new Date().toISOString() }
        : p
    );
    localStorage.setItem('plans', JSON.stringify(plans));
    set({ plans, currentPlan: plans.find(p => p.id === id) || null });
  }
}));

const getInitialPlans = (): TeachingPlan[] => [
  {
    id: 'plan-001',
    title: '2024-2025学年第一学期《数据结构》授课计划',
    teacher_id: '1',
    teacher_name: '张明华',
    college: '计算机学院',
    course_name: '数据结构',
    content: '本课程主要讲授线性表、栈、队列、树、图等基本数据结构及其常用算法。\n\n教学目标：\n1. 掌握基本数据结构的原理和实现\n2. 能够分析算法的时间复杂度和空间复杂度\n3. 培养良好的编程习惯和代码风格\n\n教学安排：\n- 第1-4周：线性表和链表\n- 第5-8周：栈和队列\n- 第9-12周：树和二叉树\n- 第13-16周：图论基础\n\n考核方式：平时成绩30%+期中考试30%+期末考试40%',
    attachments: [],
    status: 'college_reviewing',
    ai_evaluation: {
      id: 'eval-001',
      plan_id: 'plan-001',
      score: 85,
      dimension_scores: {
        completeness: 88,
        clarity: 82,
        alignment: 85,
        practicality: 85
      },
      suggestions: [
        '建议增加与产业实际应用结合的案例',
        '可以补充在线评测系统的使用说明',
        '建议明确实验项目的具体要求'
      ],
      strengths: [
        '教学目标清晰，层次分明',
        '教学内容覆盖全面',
        '考核方式合理'
      ],
      evaluated_at: '2024-12-15T10:30:00Z'
    },
    created_at: '2024-12-10T08:00:00Z',
    updated_at: '2024-12-15T10:30:00Z'
  },
  {
    id: 'plan-002',
    title: '2024-2025学年第一学期《人工智能导论》授课计划',
    teacher_id: '2',
    teacher_name: '李晓燕',
    college: '计算机学院',
    course_name: '人工智能导论',
    content: '本课程介绍人工智能的基本概念、发展历程和主要技术方向。\n\n教学目标：\n1. 理解人工智能的基本概念\n2. 掌握机器学习的基本原理\n3. 了解深度学习的应用\n\n教学安排：\n- 第1-3周：人工智能概述\n- 第4-7周：机器学习基础\n- 第8-11周：深度学习入门',
    attachments: [],
    status: 'submitted',
    created_at: '2024-12-12T14:00:00Z',
    updated_at: '2024-12-12T14:00:00Z'
  },
  {
    id: 'plan-003',
    title: '2024-2025学年第二学期《软件工程》授课计划',
    teacher_id: '1',
    teacher_name: '张明华',
    college: '计算机学院',
    course_name: '软件工程',
    content: '本课程讲授软件工程的基本理论、方法和工具。\n\n教学目标：\n1. 掌握软件工程的基本原理\n2. 熟悉软件开发过程模型\n3. 能够进行软件需求分析和设计\n\n教学安排：\n- 第1-4周：软件工程概述\n- 第5-8周：需求分析\n- 第9-12周：软件设计',
    attachments: [],
    status: 'final_approved',
    created_at: '2024-11-20T09:00:00Z',
    updated_at: '2024-12-01T16:00:00Z'
  }
];
