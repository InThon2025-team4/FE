import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_EXCHANGE_URL;

// Types
export interface Project {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  recruitmentStartDate: string;
  recruitmentEndDate: string;
  projectStartDate: string;
  projectEndDate: string;
  githubRepoUrl: string;
  limitBE: number;
  limitFE: number;
  limitPM: number;
  limitMobile: number;
  limitAI: number;
  currentBE: number;
  currentFE: number;
  currentMobile: number;
  currentAI: number;
  status: string;
  tags: string[];
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string;
    proficiency: string;
  };
  memberCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
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

export interface Application {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  position: string;
  introduction: string;
  status: string; // 'pending' | 'accepted' | 'rejected'
  appliedAt: string;
}

export interface ApplicationListResponse {
  success: boolean;
  data: Application[];
  message?: string;
}

export interface ApplicationResponse {
  success: boolean;
  data: Application;
  message?: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
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
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: string;
  startDate?: string;
  deadline?: string;
  duration?: string;
  difficulty?: string;
  positions?: {
    frontend?: string;
    backend?: string;
    ai?: string;
    mobile?: string;
  };
}

export interface GenericResponse {
  success: boolean;
  message?: string;
}

export interface OnboardingData {
  techStack: string[];
  position: string[];
  portfolio?: string;
  accessToken: string;
  proficiency: number;
}

export interface OnboardingResponse {
  success: boolean;
  message?: string;
}

/**
 * Get all projects for dashboard
 * GET /project/dashboard
 */
export async function getDashboardProjects(): Promise<ProjectListResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/project`);
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
 * Get all applications submitted by the current user
 * GET /project/applications/my
 */
export async function getMyApplications(): Promise<ApplicationListResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/project/applications/my`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching my applications:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Failed to fetch your applications",
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
 * Get all applications for a specific project
 * GET /project/{id}/applications
 * @param projectId - Project ID
 */
export async function getProjectApplications(
  projectId: string
): Promise<ApplicationListResponse> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/project/${projectId}/applications`
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      `Error fetching applications for project ${projectId}:`,
      error
    );
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Failed to fetch project applications",
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
 * Create a new project
 * POST /project
 * @param projectData - Project data to create
 */
export async function createProject(
  projectData: CreateProjectData
): Promise<ProjectDetailResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/project`, projectData);
    return {
      success: true,
      data: response.data,
      message: "Project created successfully",
    };
  } catch (error) {
    console.error("Error creating project:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: {} as Project,
        message: error.response?.data?.message || "Failed to create project",
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
 * Apply to a project
 * POST /project/{id}/apply
 * @param projectId - Project ID
 * @param applicationData - Application data (position, introduction)
 */
export async function applyToProject(
  projectId: string,
  applicationData: { position: string; introduction: string }
): Promise<ApplicationResponse> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/project/${projectId}/apply`,
      applicationData
    );
    return {
      success: true,
      data: response.data,
      message: "Application submitted successfully",
    };
  } catch (error) {
    console.error(`Error applying to project ${projectId}:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: {} as Application,
        message:
          error.response?.data?.message || "Failed to submit application",
      };
    }
    return {
      success: false,
      data: {} as Application,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Update a project
 * PUT /project/{id}
 * @param projectId - Project ID
 * @param updateData - Data to update
 */
export async function updateProject(
  projectId: string,
  updateData: UpdateProjectData
): Promise<ProjectDetailResponse> {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/project/${projectId}`,
      updateData
    );
    return {
      success: true,
      data: response.data,
      message: "Project updated successfully",
    };
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: {} as Project,
        message: error.response?.data?.message || "Failed to update project",
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
 * Update an application status (accept/reject)
 * PUT /project/{id}/applications/{userId}
 * @param projectId - Project ID
 * @param userId - User ID of the applicant
 * @param status - New status ('accepted' or 'rejected')
 */
export async function updateApplicationStatus(
  projectId: string,
  userId: string,
  status: string
): Promise<GenericResponse> {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/project/${projectId}/applications/${userId}`,
      { status }
    );
    return {
      success: true,
      message:
        response.data?.message || "Application status updated successfully",
    };
  } catch (error) {
    console.error(`Error updating application status:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to update application status",
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Delete a project
 * DELETE /project/{id}
 * @param projectId - Project ID
 */
export async function deleteProject(
  projectId: string
): Promise<GenericResponse> {
  try {
    const response = await axios.delete(`${API_BASE_URL}/project/${projectId}`);
    return {
      success: true,
      message: response.data?.message || "Project deleted successfully",
    };
  } catch (error) {
    console.error(`Error deleting project ${projectId}:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete project",
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Withdraw/cancel an application
 * DELETE /project/{id}/applications
 * @param projectId - Project ID
 */
export async function withdrawApplication(
  projectId: string
): Promise<GenericResponse> {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/project/${projectId}/applications`
    );
    return {
      success: true,
      message: response.data?.message || "Application withdrawn successfully",
    };
  } catch (error) {
    console.error(
      `Error withdrawing application from project ${projectId}:`,
      error
    );
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to withdraw application",
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Submit user onboarding information
 * POST /auth/onboard
 * @param onboardingData - User's tech stack, position, portfolio, and proficiency
 */
export async function submitOnboarding(
  onboardingData: OnboardingData
): Promise<OnboardingResponse> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/onboard`,
      onboardingData
    );
    return {
      success: true,
      message: response.data?.message || "Onboarding completed successfully",
    };
  } catch (error) {
    console.error("Error submitting onboarding:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to complete onboarding",
      };
    }
    return {
      success: false,
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
