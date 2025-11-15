import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_EXCHANGE_URL;

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  startDate: string;
  deadline: string;
  duration: string;
  difficulty: string;
  positions: {
    frontend?: string;
    backend?: string;
    ai?: string;
    mobile?: string;
  };
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ProjectListResponse {
  success: boolean;
  data: Project[];
  message?: string;
}

export interface ProjectDetailResponse {
  success: boolean;
  data: Project;
  message?: string;
}

/**
 * Get all projects for dashboard
 * GET /project/dashboard
 */
export async function getDashboardProjects(): Promise<ProjectListResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/project/dashboard`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard projects:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch projects",
      };
    }
    return {
      success: false,
      data: [],
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Get projects owned by the current user
 * GET /project/dashboard/owner
 */
export async function getOwnedProjects(): Promise<ProjectListResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/project/dashboard/owner`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching owned projects:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Failed to fetch owned projects",
      };
    }
    return {
      success: false,
      data: [],
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Get projects where the current user is a member
 * GET /project/dashboard/member
 */
export async function getMemberProjects(): Promise<ProjectListResponse> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/project/dashboard/member`
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching member projects:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Failed to fetch member projects",
      };
    }
    return {
      success: false,
      data: [],
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Get all projects (public list)
 * GET /project
 */
export async function getAllProjects(): Promise<ProjectListResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/project`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching all projects:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch projects",
      };
    }
    return {
      success: false,
      data: [],
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Get a specific project by ID
 * GET /project/{id}
 * @param id - Project ID
 */
export async function getProjectById(
  id: string
): Promise<ProjectDetailResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/project/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: {} as Project,
        message:
          error.response?.data?.message || "Failed to fetch project details",
      };
    }
    return {
      success: false,
      data: {} as Project,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Helper function to get auth token from Supabase session
 * This should be called before making authenticated requests
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  // Get token from localStorage or your auth state management
  const token = localStorage.getItem("supabase.auth.token");
  return token;
}

/**
 * Set default authorization header for axios
 * Call this after user logs in
 */
export function setAuthorizationHeader(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

/**
 * Clear authorization header
 * Call this when user logs out
 */
export function clearAuthorizationHeader() {
  delete axios.defaults.headers.common["Authorization"];
}
