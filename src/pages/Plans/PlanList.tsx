import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { usePlanStore } from '../../stores/planStore';
import {
  Search,
  Plus,
  Filter,
  FileText,
  Calendar,
  User,
  Trash2,
  Eye
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

export default function PlanList() {
  const { user } = useAuthStore();
  const { plans, fetchPlans, deletePlan } = usePlanStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlanStatus | 'all'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const filteredPlans = plans.filter(plan => {
    const matchesUser = user?.role === 'teacher' ? plan.teacher_id === user.id : true;
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesUser && matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    await deletePlan(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800">授课计划</h1>
          <p className="text-slate-500 mt-1">管理您的授课计划</p>
        </div>
        {user?.role === 'teacher' && (
          <Link to="/plans/new" className="btn btn-primary">
            <Plus size={20} />
            新建计划
          </Link>
        )}
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
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PlanStatus | 'all')}
              className="input w-auto"
            >
              <option value="all">全部状态</option>
              <option value="draft">草稿</option>
              <option value="submitted">已提交</option>
              <option value="college_reviewing">学院审核中</option>
              <option value="college_approved">学院已通过</option>
              <option value="academic_reviewing">教务审核中</option>
              <option value="final_approved">已完成</option>
              <option value="rejected">已驳回</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans list */}
      <div className="space-y-4">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan, index) => (
            <div
              key={plan.id}
              className="card p-5 hover:shadow-md transition-shadow animate-slideIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/plans/${plan.id}`)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-slate-800 text-lg">{plan.title}</h3>
                    <span className={`badge ${statusConfig[plan.status].bg} ${statusConfig[plan.status].color}`}>
                      {statusConfig[plan.status].label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <FileText size={16} />
                      <span>{plan.course_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={16} />
                      <span>{plan.teacher_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>{new Date(plan.updated_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>

                  {plan.ai_evaluation && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-slate-500">AI评分：</span>
                        <span className={`font-medium ${
                          plan.ai_evaluation.score >= 80 ? 'text-emerald-600' :
                          plan.ai_evaluation.score >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {plan.ai_evaluation.score}分
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/plans/${plan.id}`)}
                    className="btn btn-secondary"
                  >
                    <Eye size={18} />
                    查看
                  </button>
                  {user?.role === 'teacher' && plan.status === 'draft' && (
                    <button
                      onClick={() => navigate(`/plans/${plan.id}/edit`)}
                      className="btn btn-secondary"
                    >
                      编辑
                    </button>
                  )}
                  {user?.role === 'teacher' && plan.status === 'draft' && (
                    <button
                      onClick={() => setShowDeleteConfirm(plan.id)}
                      className="btn btn-danger"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Delete confirmation */}
              {showDeleteConfirm === plan.id && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 animate-fadeIn">
                  <p className="text-red-700 mb-3">确定要删除这个授课计划吗？此操作不可撤销。</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="btn btn-danger"
                    >
                      确认删除
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="btn btn-secondary"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="font-medium text-slate-600 mb-2">暂无授课计划</h3>
            <p className="text-slate-500 mb-4">开始创建您的第一个授课计划吧</p>
            {user?.role === 'teacher' && (
              <Link to="/plans/new" className="btn btn-primary">
                <Plus size={20} />
                新建计划
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
