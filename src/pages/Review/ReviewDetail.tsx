import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { usePlanStore } from '../../stores/planStore';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Building,
  Clock,
  Sparkles,
  Loader,
  MessageSquare
} from 'lucide-react';
import type { PlanStatus } from '../../types';

const statusConfig: Record<PlanStatus, { label: string; color: string; bg: string }> = {
  draft: { label: '草稿', color: 'text-slate-600', bg: 'bg-slate-100' },
  submitted: { label: '已提交', color: 'text-blue-700', bg: 'bg-blue-100' },
  college_reviewing: { label: '学院审核中', color: 'text-amber-700', bg: 'bg-amber-100' },
  college_approved: { label: '学院已通过', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  academic_reviewing: { label: '教务审核中', color: 'text-purple-700', bg: 'bg-purple-100' },
  final_approved: { label: '已完成', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  rejected: { label: '已驳回', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { plans, fetchPlans, approvePlan, rejectPlan, evaluatePlan } = usePlanStore();
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const plan = plans.find(p => p.id === id);

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size={32} className="animate-spin text-slate-400" />
      </div>
    );
  }

  const canReview = (() => {
    if (user?.role === 'college_admin') {
      return ['submitted', 'college_reviewing'].includes(plan.status);
    }
    if (user?.role === 'academic_admin') {
      return ['college_approved', 'academic_reviewing'].includes(plan.status);
    }
    return false;
  })();

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approvePlan(plan.id, comment);
      navigate('/review');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert('请填写驳回原因');
      return;
    }
    setIsProcessing(true);
    try {
      await rejectPlan(plan.id, comment);
      navigate('/review');
    } finally {
      setIsProcessing(false);
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

  const getReviewStage = () => {
    if (user?.role === 'college_admin') {
      return '学院审核';
    }
    if (user?.role === 'academic_admin') {
      return '教务处审核';
    }
    return '审核';
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/review')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-800">审核详情</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`badge ${statusConfig[plan.status].bg} ${statusConfig[plan.status].color}`}>
                {statusConfig[plan.status].label}
              </span>
              <span className="text-sm text-slate-500">{getReviewStage()}</span>
            </div>
          </div>
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
            <pre className="whitespace-pre-wrap text-slate-600 font-sans text-sm leading-relaxed bg-slate-50 p-4 rounded-lg">
              {plan.content}
            </pre>
          </div>

          {/* AI Evaluation Results */}
          {plan.ai_evaluation && (
            <div className="card p-6">
              <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-amber-500" />
                AI评估结果
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Score */}
                <div className="text-center py-6 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">综合评分</p>
                  <p className={`text-5xl font-bold ${
                    plan.ai_evaluation.score >= 80 ? 'text-emerald-600' :
                    plan.ai_evaluation.score >= 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {plan.ai_evaluation.score}
                  </p>
                  <p className="text-sm text-slate-500">分</p>
                </div>

                {/* Dimensions */}
                <div className="space-y-4">
                  <DimensionScore label="完整性" score={plan.ai_evaluation.dimension_scores.completeness} />
                  <DimensionScore label="清晰度" score={plan.ai_evaluation.dimension_scores.clarity} />
                  <DimensionScore label="对齐度" score={plan.ai_evaluation.dimension_scores.alignment} />
                  <DimensionScore label="实用性" score={plan.ai_evaluation.dimension_scores.practicality} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {plan.ai_evaluation.strengths.length > 0 && (
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm font-medium text-emerald-800 mb-2">优点</p>
                    <ul className="space-y-1">
                      {plan.ai_evaluation.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                          <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.ai_evaluation.suggestions.length > 0 && (
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 mb-2">优化建议</p>
                    <ul className="space-y-1">
                      {plan.ai_evaluation.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                          <Sparkles size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reject modal */}
          {showRejectModal && (
            <div className="card p-6 border-2 border-red-200">
              <h2 className="font-serif font-semibold text-lg text-red-700 mb-4 flex items-center gap-2">
                <XCircle size={20} />
                驳回原因
              </h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="input resize-none"
                placeholder="请填写驳回原因，以便教师修改..."
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="btn btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="btn btn-danger"
                >
                  {isProcessing ? <Loader size={18} className="animate-spin" /> : <XCircle size={18} />}
                  确认驳回
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Review actions */}
          {canReview ? (
            <div className="card p-6">
              <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                审核操作
              </h2>

              <div className="space-y-4">
                {!plan.ai_evaluation && (
                  <button
                    onClick={handleAIEvaluate}
                    disabled={isEvaluating}
                    className="btn btn-secondary w-full justify-center"
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
                )}

                <div className="pt-4 border-t border-slate-100">
                  <label className="label">审核意见（可选）</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="input resize-none text-sm"
                    placeholder="填写审核意见..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 btn btn-success"
                  >
                    {isProcessing ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                    通过
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isProcessing}
                    className="flex-1 btn btn-danger"
                  >
                    <XCircle size={18} />
                    驳回
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={20} />
                审核状态
              </h2>
              <p className="text-slate-600">
                {plan.status === 'final_approved'
                  ? '该计划已审核完成'
                  : plan.status === 'rejected'
                  ? '该计划已被驳回'
                  : '该计划正在等待审核'}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={20} />
              操作记录
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="text-sm font-medium text-slate-700">教师提交</p>
                  <p className="text-xs text-slate-500">
                    {new Date(plan.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              {plan.status !== 'submitted' && plan.status !== 'draft' && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {plan.status === 'college_approved' || plan.status === 'final_approved'
                        ? '审核通过'
                        : plan.status === 'rejected'
                        ? '已驳回'
                        : '审核中'}
                    </p>
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
