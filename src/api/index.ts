import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1";

export const API = axios.create({
  baseURL,
  timeout: 60000,
});

// Track refresh state outside the interceptor
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("promax_accessToken")
        : null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (
      error.response?.status === 403 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      const errorData = error.response.data as {
        error?: string;
        message?: string;
      };
      const isTokenExpired =
        errorData?.error === "Invalid token" ||
        errorData?.message === "Invalid token";

      if (!isTokenExpired) return Promise.reject(error);

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("promax_refreshToken")
            : null;

        if (!refreshToken) throw new Error("No refresh token");

        // Use plain axios, NOT API — avoids interceptor loop
        const res = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });

        if (res.data?.data) {
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("promax_accessToken", accessToken);
            localStorage.setItem("promax_refreshToken", newRefreshToken);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          return API(originalRequest);
        }

        throw new Error("Invalid refresh response");
      } catch (refreshError) {
        processQueue(refreshError, null);
        await handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// POST
export const post = async <T = any>(
  url: string,
  data: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await API.post<ApiResponse<T>>(url, data);
    return {
      data: response.data?.data,
      message: response.data?.message,
      success: response.data?.success,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data as ApiResponse<T>;
      if (errorResponse) {
        return {
          error:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred",
        };
      }
      return { error: error.message || "An unexpected error occurred" };
    }
    return { error: "An unexpected error occurred" };
  }
};

// PUT
export const put = async <T = any>(
  url: string,
  data: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await API.put<ApiResponse<T>>(url, data);
    return {
      data: response.data?.data,
      message: response.data?.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      };
    }
    return { error: "An unexpected error occurred" };
  }
};

// GET
export const get = async <T = any>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await API.get<ApiResponse<T>>(url);
    return {
      data: response.data?.data,
      message: response.data?.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      };
    }
    return { error: "An unexpected error occurred" };
  }
};

// DELETE
export const del = async <T = any>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await API.delete<ApiResponse<T>>(url);
    return {
      data: response.data?.data,
      message: response.data?.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      };
    }
    return { error: "An unexpected error occurred" };
  }
};

// Logout
export const handleLogout = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("promax_accessToken");
    localStorage.removeItem("promax_refreshToken");
  }
};