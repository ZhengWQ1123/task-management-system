import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { usePlanStore } from '../../stores/planStore';
import {
  ArrowLeft,
  Edit,
  Send,
  Calendar,
  User,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  Loader,
  Sparkles
} from 'lucide-react';
import type { PlanStatus } from '../../types';

const statusConfig: Record<PlanStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft: { label: '草稿', color: 'text-slate-600', bg: 'bg-slate-100', icon: FileText },
  submitted: { label: '已提交', color: 'text-blue-700', bg: 'bg-blue-100', icon: Send },
  college_reviewing: { label: '学院审核中', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
  college_approved: { label: '学院已通过', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle },
  academic_reviewing: { label: '教务审核中', color: 'text-purple-700', bg: 'bg-purple-100', icon: Clock },
  final_approved: { label: '已完成', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle },
  rejected: { label: '已驳回', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
};

function Clock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { plans, fetchPlans, fetchPlanById, currentPlan, submitPlan, evaluatePlan } = usePlanStore();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
    if (id) {
      fetchPlanById(id);
    }
  }, [id, fetchPlans, fetchPlanById]);

  const plan = plans.find(p => p.id === id) || currentPlan;

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size={32} className="animate-spin text-slate-400" />
      </div>
    );
  }

  const statusInfo = statusConfig[plan.status];
  const StatusIcon = statusInfo.icon;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitPlan(plan.id);
      await fetchPlans();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIEvaluate = async () => {
    setIsEvaluating(true);
    try {
      await evaluatePlan(plan.id);
      await fetchPlans();
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/plans')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-800">{plan.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`badge ${statusInfo.bg} ${statusInfo.color} flex items-center gap-1`}>
                <StatusIcon size={14} />
                {statusInfo.label}
              </span>
              <span className="text-sm text-slate-500">
                更新于 {new Date(plan.updated_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'teacher' && plan.status === 'draft' && (
            <>
              <button
                onClick={() => navigate(`/plans/${plan.id}/edit`)}
                className="btn btn-secondary"
              >
                <Edit size={18} />
                编辑
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                提交审核
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Book size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">课程名称</p>
                  <p className="font-medium text-slate-800">{plan.course_name}</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <User size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">授课教师</p>
                  <p className="font-medium text-slate-800">{plan.teacher_name}</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Building size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">所属学院</p>
                  <p className="font-medium text-slate-800">{plan.college}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={20} />
              授课计划内容
            </h2>
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap text-slate-600 font-sans text-sm leading-relaxed bg-slate-50 p-4 rounded-lg">
                {plan.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Evaluation */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              AI评估
            </h2>

            {plan.ai_evaluation ? (
              <div className="space-y-4">
                {/* Score */}
                <div className="text-center py-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">综合评分</p>
                  <p className={`text-4xl font-bold ${
                    plan.ai_evaluation.score >= 80 ? 'text-emerald-600' :
                    plan.ai_evaluation.score >= 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {plan.ai_evaluation.score}
                  </p>
                  <p className="text-sm text-slate-500">分</p>
                </div>

                {/* Dimension scores */}
                <div className="space-y-3">
                  <DimensionScore label="完整性" score={plan.ai_evaluation.dimension_scores.completeness} />
                  <DimensionScore label="清晰度" score={plan.ai_evaluation.dimension_scores.clarity} />
                  <DimensionScore label="对齐度" score={plan.ai_evaluation.dimension_scores.alignment} />
                  <DimensionScore label="实用性" score={plan.ai_evaluation.dimension_scores.practicality} />
                </div>

                {/* Strengths */}
                {plan.ai_evaluation.strengths.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">优点</p>
                    <ul className="space-y-1">
                      {plan.ai_evaluation.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {plan.ai_evaluation.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">优化建议</p>
                    <ul className="space-y-1">
                      {plan.ai_evaluation.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <Sparkles size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-slate-400 pt-2">
                  评估时间：{new Date(plan.ai_evaluation.evaluated_at).toLocaleString('zh-CN')}
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <Sparkles size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500 mb-4">暂无AI评估结果</p>
                <button
                  onClick={handleAIEvaluate}
                  disabled={isEvaluating}
                  className="btn btn-primary w-full"
                >
                  {isEvaluating ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      AI评估中...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      发起AI评估
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              操作记录
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="text-sm font-medium text-slate-700">创建计划</p>
                  <p className="text-xs text-slate-500">
                    {new Date(plan.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              {plan.status !== 'draft' && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">提交审核</p>
                    <p className="text-xs text-slate-500">
                      {new Date(plan.updated_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DimensionScore({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-800">{score}分</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function Book({ size, className }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    </svg>
  );
}
