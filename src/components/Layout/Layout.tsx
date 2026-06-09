import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, getRoleName } from '../../stores/authStore';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { path: '/dashboard', label: '仪表盘', icon: LayoutDashboard, roles: ['teacher', 'college_admin', 'academic_admin', 'system_admin'] },
  { path: '/plans', label: '授课计划', icon: FileText, roles: ['teacher'] },
  { path: '/review', label: '审核管理', icon: CheckSquare, roles: ['college_admin', 'academic_admin', 'system_admin'] },
  { path: '/training-programs', label: '培养方案', icon: BookOpen, roles: ['system_admin', 'academic_admin'] },
  { path: '/settings', label: '系统设置', icon: Settings, roles: ['system_admin'] },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-600" size={28} />
          <span className="font-serif font-bold text-lg text-slate-800">教学管理系统</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
            <GraduationCap className="text-blue-600" size={32} />
            <div>
              <h1 className="font-serif font-bold text-lg text-slate-800">教学管理</h1>
              <p className="text-xs text-slate-500">Teaching Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500">{user ? getRoleName(user.role) : ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
