import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { usePlanStore } from '../../stores/planStore';
import {
  Search,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  Sparkles
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

export default function ReviewList() {
  const { user } = useAuthStore();
  const { plans, fetchPlans } = usePlanStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const getReviewablePlans = () => {
    let filtered = plans.filter(plan => {
      if (user?.role === 'college_admin') {
        return ['submitted', 'college_reviewing'].includes(plan.status);
      }
      if (user?.role === 'academic_admin') {
        return ['college_approved', 'academic_reviewing'].includes(plan.status);
      }
      return false;
    });

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const reviewablePlans = getReviewablePlans();
  const otherPlans = plans.filter(p => !reviewablePlans.find(rp => rp.id === p.id));

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-800">审核管理</h1>
        <p className="text-slate-500 mt-1">审核教师提交的授课计划</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          待审核 ({reviewablePlans.length})
        </button>
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          全部 ({otherPlans.length})
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索授课计划..."
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Plans list */}
      <div className="space-y-4">
        {(statusFilter === 'pending' ? reviewablePlans : otherPlans).length > 0 ? (
          (statusFilter === 'pending' ? reviewablePlans : otherPlans).map((plan, index) => (
            <div
              key={plan.id}
              className={`card p-5 transition-shadow animate-slideIn ${
                statusFilter === 'pending' ? 'hover:shadow-md border-l-4 border-l-blue-500' : 'hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-slate-800 text-lg">{plan.title}</h3>
                    <span className={`badge ${statusConfig[plan.status].bg} ${statusConfig[plan.status].color}`}>
                      {statusConfig[plan.status].label}
                    </span>
                    {plan.ai_evaluation && statusFilter === 'pending' && (
                      <span className="badge bg-amber-50 text-amber-700 flex items-center gap-1">
                        <Sparkles size={12} />
                        AI评估{plan.ai_evaluation.score}分
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <FileText size={16} />
                      <span>{plan.course_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{plan.teacher_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{plan.college}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>{new Date(plan.updated_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/review/${plan.id}`)}
                  className="btn btn-primary"
                >
                  {statusFilter === 'pending' ? '立即审核' : '查看详情'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <CheckCircle size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="font-medium text-slate-600 mb-2">暂无{statusFilter === 'pending' ? '待审核' : ''}计划</h3>
            <p className="text-slate-500">
              {statusFilter === 'pending' ? '所有计划都已审核完成' : '没有找到相关计划'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
