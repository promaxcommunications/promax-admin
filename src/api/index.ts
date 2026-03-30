import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Define a custom response interface
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1";
// Create a typed API client
export const API = axios.create({
  baseURL,
  timeout: 60000,
});

// Request interceptor to add token to every request
API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("promax_accessToken")
        : null;
    // console.log(accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh logic for auth-related endpoints
    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register");

    // Check if it's a 401 and not an auth request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      // Extract error details from the response
      const errorData = error.response.data as {
        error?: string;
        message?: string;
      };
      const isTokenExpired =
        errorData?.error === "Invalid token" ||
        errorData?.message === "Invalid token";

      if (isTokenExpired) {
        originalRequest._retry = true;

        try {
          const refreshToken =
            typeof window !== "undefined"
              ? localStorage.getItem("promax_refreshToken")
              : null;

          if (!refreshToken) {
            throw new Error("No refresh token");
          }

          console.log("Refresh token expired, generating new one");

          const res = await axios.post<
            ApiResponse<{
              accessToken: string;
              refreshToken: string;
            }>
          >(`${baseURL}/auth/refresh-token`, {
            refreshToken,
          });

          // if (res.data?.data) {
          //   const { accessToken, refreshToken: newRefreshToken } =
          //     res.data.data;

          //   if (typeof window !== "undefined") {
          //     localStorage.setItem(
          //       "promax_accessToken",
          //       JSON.stringify(accessToken)
          //     );
          //     localStorage.setItem(
          //       "promax_refreshToken",
          //       JSON.stringify(newRefreshToken)
          //     );
          //   }

          //   if (originalRequest.headers) {
          //     originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          //   }

          //   return API(originalRequest);
          // }
          if (res.data?.data) {
  const { accessToken, refreshToken: newRefreshToken } = res.data.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("promax_accessToken", accessToken);   // ✅ no JSON.stringify
    localStorage.setItem("promax_refreshToken", newRefreshToken);
  }

  if (originalRequest.headers) {
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
  }

  return API(originalRequest);
}
        } catch (refreshError) {
          await handleLogout();
          return Promise.reject(refreshError);
        }
      }
    }

    // Pass through all other errors (including non-expired 401s)
    return Promise.reject(error);
  }
);

// Modified post method
export const post = async <T = any>(
  url: string,
  data: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await API.post<ApiResponse<T>>(url, data);
    console.log("Raw API response:", response.data); // Log the full response

    return {
      data: response.data?.data,
      message: response.data?.message,
      success: response.data?.success, // Include success field
    };
  } catch (error) {
    console.log("Post error:", error);

    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data as ApiResponse<T>;
      console.log("Error response data:", errorResponse);

      // Return the error response if it exists, even for non-401 errors
      if (errorResponse) {
        // return {
        //   data: errorResponse.data,
        //   message: errorResponse.message,
        //   error: error.message,
        //   success: errorResponse.success,
        // };
        return {
          error:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred",
        };
      }

      return {
        error: error.message || "An unexpected error occurred",
      };
    }
    return { error: "An unexpected error occurred" };
  }
};

// Modified put method
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

// Modified get method

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

// New delete method
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

// Logout function
export const handleLogout = async () => {
  console.log("Logging out...");

  if (typeof window !== "undefined") {
    localStorage.removeItem("promax_accessToken");
    localStorage.removeItem("promax_refreshToken");
  }
};
