// Todo Types
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status?: 'TODO' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TodosResponse {
  data: Todo[];
  meta: {
    totalPages: number;
    currentPage: number;
    total: number;
    limit?: number;
  };
}

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  accessToken?: string;
  user?: User;
  data?: {
    token?: string;
    user?: User;
  };
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  signup: (userData: SignupData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Component Props
export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  initialData?: Todo | null;
  isLoading?: boolean;
}

export interface DeleteConfirmationProps {
  todoTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}