import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'RH' | 'EMPLOYEE';
  passwordChangeRequired?: boolean;
  avatar?: string;
  employee?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      },
      
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  
  setEmployees: (employees: Employee[]) => void;
  setCurrentEmployee: (employee: Employee | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (totalPages: number, currentPage: number, total: number) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
  
  setEmployees: (employees) => set({ employees }),
  setCurrentEmployee: (employee) => set({ currentEmployee: employee }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (totalPages, currentPage, total) => set({ totalPages, currentPage, total }),
  
  addEmployee: (employee) => {
    const { employees } = get();
    set({ employees: [employee, ...employees] });
  },
  
  updateEmployee: (id, updatedEmployee) => {
    const { employees } = get();
    set({
      employees: employees.map(emp => 
        emp._id === id ? { ...emp, ...updatedEmployee } : emp
      )
    });
  },
  
  removeEmployee: (id) => {
    const { employees } = get();
    set({ employees: employees.filter(emp => emp._id !== id) });
  },
}));
