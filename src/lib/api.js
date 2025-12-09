class ApiClient {
  constructor() {
    this.baseURL = "https://busy-fool-backend.vercel.app"
    // this.baseURL = "http://localhost:3000";
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Process failed requests queue after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Refresh access token using refresh token from HttpOnly cookie
  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Include cookies for refresh token
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } else {
        throw new Error("No access token in refresh response");
      }
    } catch (error) {
      // Refresh failed, redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginSuccess");
      window.location.href = "/login";
      throw error;
    }
  }

  // Enhanced fetch with automatic token refresh
  async fetch(url, options = {}) {
    const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;

    // Add authorization header if token exists
    const token = localStorage.getItem("accessToken");
    if (token && !options.headers?.Authorization) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Include credentials for all auth endpoints to ensure cookies are set/sent
    const needsCredentials =
      url.includes("/auth/") || options.needsCredentials;
    if (needsCredentials) {
      options.credentials = "include";
    }

    try {
      const response = await fetch(fullUrl, options);

      // If request succeeds, return response
      if (response.ok || response.status !== 401) {
        return response;
      }

      // Handle 401 - token expired
      if (response.status === 401) {
        // If already refreshing, queue this request
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(() => {
            // Retry with new token
            const newToken = localStorage.getItem("accessToken");
            if (newToken) {
              options.headers.Authorization = `Bearer ${newToken}`;
            }
            return fetch(fullUrl, options);
          });
        }

        // Start refresh process
        this.isRefreshing = true;

        try {
          const newToken = await this.refreshToken();
          this.processQueue(null, newToken);

          // Retry original request with new token
          options.headers.Authorization = `Bearer ${newToken}`;
          const retryResponse = await fetch(fullUrl, options);

          return retryResponse;
        } catch (refreshError) {
          this.processQueue(refreshError, null);
          throw refreshError;
        } finally {
          this.isRefreshing = false;
        }
      }

      return response;
    } catch (error) {
      // Network error or other issues
      throw error;
    }
  }

  // Convenience methods
  async get(url, options = {}) {
    return this.fetch(url, { ...options, method: "GET" });
  }

  async post(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  }

  async put(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  }

  async delete(url, options = {}) {
    return this.fetch(url, { ...options, method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience function for backward compatibility
export const apiFetch = (url, options) => apiClient.fetch(url, options);
