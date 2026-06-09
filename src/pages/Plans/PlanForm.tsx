import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { usePlanStore } from '../../stores/planStore';
import { ArrowLeft, Save, Send, FileText, Loader } from 'lucide-react';

export default function PlanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { plans, fetchPlans, createPlan, updatePlan, submitPlan } = usePlanStore();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    course_name: '',
    content: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (isEditing && id) {
      const plan = plans.find(p => p.id === id);
      if (plan) {
        setFormData({
          title: plan.title,
          course_name: plan.course_name,
          content: plan.content,
        });
      }
    }
  }, [id, plans, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (_asDraft: boolean = true) => {
    if (!formData.title.trim()) {
      alert('请输入计划标题');
      return;
    }
    if (!formData.course_name.trim()) {
      alert('请输入课程名称');
      return;
    }

    setIsSaving(true);
    try {
      const planData = {
        ...formData,
        teacher_id: user?.id || '',
        teacher_name: user?.name || '',
        college: user?.college || '',
      };

      if (isEditing && id) {
        await updatePlan(id, planData);
      } else {
        await createPlan(planData);
      }

      navigate('/plans');
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.course_name.trim()) {
      alert('请填写完整信息后再提交');
      return;
    }

    setIsSubmitting(true);
    try {
      let planId: string;

      if (isEditing && id) {
        await updatePlan(id, formData);
        planId = id;
      } else {
        const newPlan = await createPlan({
          ...formData,
          teacher_id: user?.id || '',
          teacher_name: user?.name || '',
          college: user?.college || '',
        });
        planId = newPlan.id;
      }

      await submitPlan(planId);
      navigate('/plans');
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const templateContent = `本课程主要讲授以下内容：

教学目标：
1. 掌握本课程的基本概念和核心理论
2. 能够运用所学知识解决实际问题
3. 培养科学思维和创新意识

教学安排：
- 第1-4周：基础理论模块
- 第5-8周：核心知识模块
- 第9-12周：应用实践模块
- 第13-16周：综合提升模块

考核方式：
- 平时成绩（含课堂参与、作业）：30%
- 期中考试：30%
- 期末考试：40%`;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/plans')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-800">
              {isEditing ? '编辑授课计划' : '新建授课计划'}
            </h1>
            <p className="text-slate-500 mt-1">
              {isEditing ? '修改授课计划内容' : '创建新的授课计划'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <div className="space-y-6">
          <div>
            <label className="label">计划标题 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="例如：2024-2025学年第一学期《数据结构》授课计划"
            />
          </div>

          <div>
            <label className="label">课程名称 *</label>
            <input
              type="text"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              className="input"
              placeholder="例如：数据结构"
            />
          </div>

          <div>
            <label className="label">授课计划内容 *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={18}
              className="input resize-none font-mono text-sm"
              placeholder="请输入授课计划详细内容..."
            />
            {!isEditing && !formData.content && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, content: templateContent }))}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <FileText size={16} />
                使用模板
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              * 表示必填项
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving || isSubmitting}
                className="btn btn-secondary"
              >
                {isSaving ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                保存草稿
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving || isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                提交审核
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
