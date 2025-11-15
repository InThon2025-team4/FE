import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getStoredToken } from "./auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Make API request with automatic JWT token injection
 * 
 * @param endpoint API endpoint (e.g., '/users/profile' or full URL)
 * @param options Fetch options
 * @returns Response from API
 * 
 * @example
 * const data = await apiCall('/users/profile', { method: 'GET' })
 * const result = await data.json()
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  
  const token = getStoredToken()
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  if (options.headers && typeof options.headers === "object") {
    Object.assign(headers, options.headers)
  }
  
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`
  
  return fetch(url, {
    ...options,
    headers,
  })
}
