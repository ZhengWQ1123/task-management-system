import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { usePlanStore } from '../../stores/planStore';
import { getRoleName } from '../../stores/authStore';
import {
  FileText,
  CheckSquare,
  Clock,
  AlertCircle,
  BookOpen,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

export default function Dashboard() {
  const { user } = useAuthStore();
  const { plans, fetchPlans } = usePlanStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const filteredPlans = plans.filter(plan => {
    if (user?.role === 'teacher') {
      return plan.teacher_id === user.id;
    }
    if (user?.role === 'college_admin') {
      return plan.college === user.college;
    }
    return true;
  });

  const stats = {
    total: filteredPlans.length,
    submitted: filteredPlans.filter(p => p.status !== 'draft').length,
    reviewing: filteredPlans.filter(p => ['submitted', 'college_reviewing', 'academic_reviewing'].includes(p.status)).length,
    approved: filteredPlans.filter(p => p.status === 'final_approved').length,
    rejected: filteredPlans.filter(p => p.status === 'rejected').length,
  };

  const recentPlans = [...filteredPlans]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-slate-800">
          欢迎回来，{user?.name}
        </h1>
        <p className="text-slate-500 mt-1">
          {getRoleName(user?.role || 'teacher')} · {user?.college || '教务处'}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="总计划数"
          value={stats.total}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="待审核"
          value={stats.reviewing}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="已通过"
          value={stats.approved}
          icon={CheckSquare}
          color="emerald"
        />
        <StatCard
          title="已驳回"
          value={stats.rejected}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Quick actions and recent plans */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="font-serif font-semibold text-lg text-slate-800 mb-4">快捷操作</h2>
          <div className="space-y-3">
            {user?.role === 'teacher' && (
              <Link
                to="/plans/new"
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Plus size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">新建授课计划</p>
                  <p className="text-sm text-slate-500">创建新的授课计划</p>
                </div>
                <ArrowRight size={20} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}
            {(user?.role === 'college_admin' || user?.role === 'academic_admin' || user?.role === 'system_admin') && (
              <Link
                to="/review"
                className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <CheckSquare size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">审核管理</p>
                  <p className="text-sm text-slate-500">查看待审核材料</p>
                </div>
                <ArrowRight size={20} className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}
            <Link
              to="/plans"
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center text-white">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">授课计划列表</p>
                <p className="text-sm text-slate-500">查看所有计划</p>
              </div>
              <ArrowRight size={20} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Recent plans */}
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-serif font-semibold text-lg text-slate-800">最近更新</h2>
            <Link to="/plans" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              查看全部
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentPlans.length > 0 ? (
              recentPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/plans/${plan.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-800 truncate">{plan.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span>{plan.course_name}</span>
                        <span>·</span>
                        <span>{plan.teacher_name}</span>
                      </div>
                    </div>
                    <span className={`badge ${statusConfig[plan.status].bg} ${statusConfig[plan.status].color}`}>
                      {statusConfig[plan.status].label}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                <p>暂无授课计划</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'amber' | 'emerald' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
