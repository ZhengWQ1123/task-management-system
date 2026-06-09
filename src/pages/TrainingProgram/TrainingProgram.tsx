import { useEffect, useState } from 'react';
import { GraduationCap, BookOpen, Target, Briefcase, ChevronRight, Loader } from 'lucide-react';
import type { TrainingProgram } from '../../types';

const mockPrograms: TrainingProgram[] = [
  {
    id: 'tp-001',
    name: '计算机科学与技术专业培养方案',
    college: '计算机学院',
    objectives: [
      '培养具有良好的科学素养和人文情怀的应用型高级专门人才',
      '掌握计算机科学与技术领域的基础理论、基本知识和基本技能',
      '具备创新意识和工程实践能力，能够从事计算机系统开发与应用'
    ],
    courses: [
      '计算机导论', '程序设计基础', '数据结构', '算法设计与分析',
      '计算机组成原理', '操作系统', '计算机网络', '数据库原理',
      '软件工程', '人工智能导论'
    ],
    industry_requirements: [
      '具备软件开发能力，熟悉主流开发语言和框架',
      '了解云计算、大数据、人工智能等新技术',
      '具有良好的团队协作和沟通能力',
      '掌握软件工程规范，具备项目管理能力'
    ],
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z'
  },
  {
    id: 'tp-002',
    name: '软件工程专业培养方案',
    college: '计算机学院',
    objectives: [
      '培养掌握软件工程领域基础理论和技术方法的工程型、应用型人才',
      '具备软件系统的分析、设计、开发、测试和管理能力'
    ],
    courses: [
      '软件工程导论', '面向对象程序设计', '数据结构', '数据库原理',
      '软件架构与设计模式', '软件测试', '软件项目管理'
    ],
    industry_requirements: [
      '熟悉软件工程标准与规范',
      '具备需求分析和系统设计能力',
      '掌握敏捷开发和DevOps实践'
    ],
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z'
  }
];

export default function TrainingProgram() {
  const [programs] = useState<TrainingProgram[]>(mockPrograms);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  useEffect(() => {
    if (programs.length > 0 && !selectedProgram) {
      setSelectedProgram(programs[0]);
    }
  }, [programs, selectedProgram]);

  if (!selectedProgram) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size={32} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-800">专业培养方案</h1>
        <p className="text-slate-500 mt-1">管理与查看专业培养方案、课程标准与产业需求</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Program list */}
        <div className="card divide-y divide-slate-100">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="font-serif font-semibold text-white flex items-center gap-2">
              <GraduationCap size={20} />
              培养方案列表
            </h2>
          </div>
          {programs.map((program) => (
            <button
              key={program.id}
              onClick={() => setSelectedProgram(program)}
              className={`w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-center justify-between ${
                selectedProgram.id === program.id ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <p className={`font-medium ${selectedProgram.id === program.id ? 'text-blue-700' : 'text-slate-800'}`}>
                  {program.name}
                </p>
                <p className="text-sm text-slate-500">{program.college}</p>
              </div>
              <ChevronRight size={20} className={selectedProgram.id === program.id ? 'text-blue-600' : 'text-slate-400'} />
            </button>
          ))}
        </div>

        {/* Program detail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <GraduationCap size={28} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-slate-800">{selectedProgram.name}</h2>
                <p className="text-slate-500">{selectedProgram.college}</p>
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="card p-6">
            <h3 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-emerald-600" />
              培养目标
            </h3>
            <ul className="space-y-3">
              {selectedProgram.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-emerald-700">{i + 1}</span>
                  </div>
                  <span className="text-slate-600">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div className="card p-6">
            <h3 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              核心课程
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProgram.courses.map((course, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

          {/* Industry requirements */}
          <div className="card p-6">
            <h3 className="font-serif font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-amber-600" />
              产业需求
            </h3>
            <div className="space-y-3">
              {selectedProgram.industry_requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <Briefcase size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-amber-800">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alignment info */}
          <div className="card p-6 border-2 border-dashed border-slate-200">
            <h3 className="font-serif font-semibold text-lg text-slate-800 mb-3">人培方案对齐</h3>
            <p className="text-slate-600 text-sm">
              本培养方案已与教育部《普通高等学校本科专业类教学质量国家标准》和相关产业标准对齐，
              确保毕业生具备符合行业发展需求的知识结构和实践能力。
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
              </div>
              <span className="text-sm font-medium text-emerald-700">95%对齐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
