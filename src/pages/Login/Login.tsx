import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }

    const success = await login(username, password);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('用户名或密码错误，请重试');
    }
  };

  const demoAccounts = [
    { username: 'teacher1', role: '教师', name: '张明华' },
    { username: 'college_admin', role: '学院管理员', name: '王建国' },
    { username: 'academic_admin', role: '教务处管理员', name: '刘淑芬' },
    { username: 'admin', role: '系统管理员', name: '系统管理员' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <GraduationCap className="text-white" size={36} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white mb-1">校级授课计划管理系统</h1>
            <p className="text-blue-100 text-sm">Teaching Plan Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 animate-slideIn">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="label">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  placeholder="请输入用户名"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="label">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="请输入密码"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary mt-8 justify-center text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '登 录'
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="px-8 pb-8">
            <div className="border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-500 mb-4 text-center">测试账号（任选其一）：</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.username}
                    type="button"
                    onClick={() => setUsername(account.username)}
                    className="p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
                  >
                    <p className="font-medium text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                      {account.name}
                    </p>
                    <p className="text-xs text-slate-500">{account.role}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          © 2024 校级授课计划管理系统 v1.0
        </p>
      </div>
    </div>
  );
}
