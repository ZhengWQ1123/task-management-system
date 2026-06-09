import { create } from 'zustand';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'teacher1',
    name: '张明华',
    role: 'teacher',
    college: '计算机学院',
    email: 'zhangmh@university.edu.cn'
  },
  {
    id: '2',
    username: 'teacher2',
    name: '李晓燕',
    role: 'teacher',
    college: '计算机学院',
    email: 'lixy@university.edu.cn'
  },
  {
    id: '3',
    username: 'college_admin',
    name: '王建国',
    role: 'college_admin',
    college: '计算机学院',
    email: 'wangjg@university.edu.cn'
  },
  {
    id: '4',
    username: 'academic_admin',
    name: '刘淑芬',
    role: 'academic_admin',
    college: '教务处',
    email: 'liushf@university.edu.cn'
  },
  {
    id: '5',
    username: 'admin',
    name: '系统管理员',
    role: 'system_admin',
    college: '信息中心',
    email: 'admin@university.edu.cn'
  }
];

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (username: string, _password: string) => {
    set({ isLoading: true });

    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.username === username);

    if (user) {
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }

    set({ isLoading: false });
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  }
}));

export const getRoleName = (role: User['role']): string => {
  const roleMap: Record<User['role'], string> = {
    teacher: '教师',
    college_admin: '学院管理员',
    academic_admin: '教务处管理员',
    system_admin: '系统管理员'
  };
  return roleMap[role];
};
