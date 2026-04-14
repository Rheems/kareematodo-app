import axios, { AxiosError, AxiosResponse } from "axios";
import type {
  Todo,
  TodoFormData,
  TodosResponse,
  AuthResponse,
  User,
  LoginCredentials,
  SignupData,
} from "../types";

const API_BASE_URL = "https://api.oluwasetemi.dev";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced error logging
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

// TODO API

export const todoAPI = {
  getTodos: async (page = 1, limit = 10): Promise<TodosResponse> => {
    try {
      const response = await api.get<any>(`/tasks?page=${page}&limit=${limit}`);
      console.log("✅ Get tasks response:", response.data);

      const tasks = response.data.data || response.data.tasks || response.data;

      const totalPages =
        response.data.totalPages ||
        response.data.total_pages ||
        Math.ceil((response.data.total || tasks.length) / limit) ||
        1;

      const currentPage = response.data.page || page;
      const total = response.data.total || tasks.length;

      const transformedTasks: Todo[] = Array.isArray(tasks)
        ? tasks.map((task: any) => ({
            id: task.id,
            title: task.name || task.title,
            description: task.description,
            completed: task.status === "DONE" || task.completed === true,
            status: task.status,
            priority: task.priority,
            createdAt: task.createdAt || task.created_at,
            updatedAt: task.updatedAt || task.updated_at,
            userId: task.owner || task.user_id || task.userId,
          }))
        : [];

      return {
        data: transformedTasks,
        meta: {
          totalPages,
          currentPage,
          total,
          limit,
        },
      };
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      throw error;
    }
  },

  getTodo: async (id: string): Promise<Todo> => {
    try {
      const response = await api.get<any>(`/tasks/${id}`);
      const task = response.data.data || response.data;

      return {
        id: task.id,
        title: task.name || task.title,
        description: task.description,
        completed: task.status === "DONE" || task.completed === true,
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt || task.created_at,
        updatedAt: task.updatedAt || task.updated_at,
        userId: task.owner || task.user_id || task.userId,
      };
    } catch (error) {
      console.error("❌ Error fetching task:", error);
      throw error;
    }
  },

  createTodo: async (todoData: TodoFormData): Promise<Todo> => {
    try {
      const taskData = {
        name: todoData.title,
        description: todoData.description || null,
        status: todoData.completed ? "DONE" : "TODO",
        priority: todoData.priority || "MEDIUM",
      };

      const response = await api.post<any>("/tasks", taskData);
      const task = response.data.data || response.data;

      return {
        id: task.id,
        title: task.name || task.title,
        description: task.description,
        completed: task.status === "DONE" || task.completed === true,
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt || task.created_at,
      };
    } catch (error) {
      console.error("❌ Error creating task:", error);
      throw error;
    }
  },

  updateTodo: async (id: string, todoData: TodoFormData): Promise<Todo> => {
    try {
      const taskData = {
        name: todoData.title,
        description: todoData.description || null,
        status: todoData.completed ? "DONE" : "TODO",
        priority: todoData.priority || "MEDIUM",
      };

      let response;
      try {
        response = await api.patch<any>(`/tasks/${id}`, taskData);
      } catch (patchError) {
        response = await api.put<any>(`/tasks/${id}`, taskData);
      }

      const task = response.data.data || response.data;
      return {
        id: task.id,
        title: task.name || task.title,
        description: task.description,
        completed: task.status === "DONE" || task.completed === true,
        status: task.status,
        priority: task.priority,
        updatedAt: task.updatedAt || task.updated_at,
      };
    } catch (error) {
      console.error("❌ Error updating task:", error);
      throw error;
    }
  },

  deleteTodo: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      throw error;
    }
  },
};

//AUTH API

export const authAPI = {
  register: async (userData: SignupData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("⚠️ Logout error (ignored):", error);
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<any>("/auth/me");
      const user = response.data.data || response.data.user || response.data;
      return user;
    } catch (error) {
      console.error("❌ Get profile error:", error);
      throw error;
    }
  },
};
