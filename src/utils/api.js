import axios from "axios";

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
  (response) => response,
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

// TODO/TASK API - Using /tasks endpoint
export const todoAPI = {
  getTodos: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/tasks?page=${page}&limit=${limit}`);
      console.log("✅ Get tasks response:", response.data);

      // Handle different response structures
      const tasks = response.data.data || response.data.tasks || response.data;

      // Extract pagination metadata with fallbacks
      const totalPages =
        response.data.totalPages ||
        response.data.total_pages ||
        response.data.meta?.totalPages ||
        Math.ceil((response.data.total || tasks.length) / limit) ||
        1;

      const currentPage =
        response.data.page ||
        response.data.current_page ||
        response.data.meta?.currentPage ||
        page;

      const total =
        response.data.total ||
        response.data.total_count ||
        response.data.meta?.total ||
        tasks.length;

      // Transform tasks to our format
      const transformedTasks = Array.isArray(tasks)
        ? tasks.map((task) => ({
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

      console.log("📊 Transformed data:", {
        totalTasks: transformedTasks.length,
        totalPages: totalPages,
        currentPage: currentPage,
        total: total,
      });

      return {
        data: transformedTasks,
        meta: {
          totalPages: totalPages,
          currentPage: currentPage,
          total: total,
          limit: limit,
        },
      };
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      throw error;
    }
  },

  getTodo: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      console.log("✅ Get single task response:", response.data);

      const task = response.data.data || response.data;

      // Transform to our format
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

  createTodo: async (todoData) => {
    try {
      // Transform our format to API format
      const taskData = {
        name: todoData.title,
        description: todoData.description || null,
        status: todoData.completed ? "DONE" : "TODO",
        priority: todoData.priority || "MEDIUM",
      };

      console.log("📤 Creating task with data:", taskData);

      const response = await api.post("/tasks", taskData);
      console.log("✅ Create task response:", response.data);

      // Transform response back
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
      console.error("❌ Error creating task:", error.response?.data || error);
      throw error;
    }
  },

  updateTodo: async (id, todoData) => {
    try {
      // Transform our format to API format
      const taskData = {
        name: todoData.title,
        description: todoData.description || null,
        status: todoData.completed ? "DONE" : "TODO",
        priority: todoData.priority || "MEDIUM",
      };

      console.log("📤 Updating task", id, "with data:", taskData);

      // Try PATCH first (most REST APIs prefer PATCH for partial updates)
      let response;
      try {
        response = await api.patch(`/tasks/${id}`, taskData);
        console.log("✅ Update task response (PATCH):", response.data);
      } catch (patchError) {
        // If PATCH fails (404 or 405), try PUT
        if (
          patchError.response?.status === 404 ||
          patchError.response?.status === 405
        ) {
          console.log("⚠️ PATCH failed, trying PUT...");
          response = await api.put(`/tasks/${id}`, taskData);
          console.log("✅ Update task response (PUT):", response.data);
        } else {
          throw patchError;
        }
      }

      // Transform response back
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
      console.error("❌ Error updating task:", error.response?.data || error);
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      console.log("🗑️ Deleting task:", id);
      const response = await api.delete(`/tasks/${id}`);
      console.log("✅ Delete task response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting task:", error.response?.data || error);
      throw error;
    }
  },
};

// AUTH API
export const authAPI = {
  register: async (userData) => {
    try {
      console.log("📤 Registering user:", userData.email);
      const response = await api.post("/auth/register", userData);
      console.log("✅ Register response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log("📤 Logging in user:", credentials.email);
      const response = await api.post("/auth/login", credentials);
      console.log("✅ Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      console.log("✅ Logout response:", response.data);
      return response.data;
    } catch (error) {
      console.error("⚠️ Logout error (ignored):", error);
      // Don't throw error on logout - just clear token
      return { success: true };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/auth/me");
      console.log("✅ Get profile response:", response.data);

      // Handle different response structures
      const user = response.data.data || response.data.user || response.data;
      return user;
    } catch (error) {
      console.error("❌ Get profile error:", error.response?.data || error);
      throw error;
    }
  },
};
