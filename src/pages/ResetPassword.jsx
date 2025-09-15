"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Coffee, Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowRight, Shield, ArrowLeft } from "lucide-react"

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [toastType, setToastType] = useState("success")
  const [resetToken, setResetToken] = useState("")
  const [tokenValid, setTokenValid] = useState(true)

  // Theme colors matching forgot password
  const theme = {
    background: "#FAFBFC",
    surface: "#FFFFFF",
    primary: "#175E3B",
    primaryVariant: "#059669",
    secondary: "#F0FDF4",
    tertiary: "#6B7280",
    textPrimary: "#111827",
    textSecondary: "#B5B5B5",
    border: "#E5E7EB",
    success: "#10B981",
    error: "#EF4444",
    gradient: ["#F0FDF4", "#ECFDF5"]
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password", "")

  useEffect(() => {
    // Extract token from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    if (!token) {
      setTokenValid(false)
      showToastMessage("Invalid or missing reset token", "error")
    } else {
      setResetToken(token)
    }
  }, [])

  const showToastMessage = (message, type = "success") => {
    setToastMsg(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 5000)
  }

  const onSubmit = async (data) => {
    if (!resetToken) {
      showToastMessage("Invalid reset token", "error")
      return
    }

    setIsLoading(true)
    try {
      // Replace this with your actual API call
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          newPassword: data.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        showToastMessage(errorData.message || "Failed to reset password", "error")
        return
      }

      // Success - password reset
      showToastMessage("Password reset successfully! Redirecting to login...", "success")

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    } catch (error) {
      showToastMessage("Network error. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const getToastIcon = () => {
    switch (toastType) {
      case "success":
        return <CheckCircle className="w-6 h-6" style={{ color: theme.success }} />
      case "error":
        return <XCircle className="w-6 h-6" style={{ color: theme.error }} />
      default:
        return <CheckCircle className="w-6 h-6" style={{ color: theme.success }} />
    }
  }

  const getToastColors = () => {
    switch (toastType) {
      case "success":
        return {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderLeftColor: theme.success
        }
      case "error":
        return {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderLeftColor: theme.error
        }
      default:
        return {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderLeftColor: theme.success
        }
    }
  }

  if (!tokenValid) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4 py-8"
        style={{
          background: `linear-gradient(135deg, ${theme.gradient[0]} 0%, ${theme.gradient[1]} 100%)`
        }}
      >
        <div className="w-full max-w-md">
          <div 
            className="backdrop-blur-xl shadow-2xl rounded-3xl p-8 text-center"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: `1px solid ${theme.border}20`
            }}
          >
            <div 
              className="p-3 rounded-full w-fit mx-auto mb-4"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            >
              <XCircle className="w-8 h-8" style={{ color: theme.error }} />
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: theme.textPrimary }}>
              Invalid Reset Link
            </h1>
            <p className="mb-6" style={{ color: theme.tertiary }}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
              onClick={() => window.location.href = "/forgot-password"}
              className="inline-flex items-center px-6 py-3 text-white font-medium rounded-xl transition-all duration-300"
              style={{ backgroundColor: theme.success }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryVariant}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.success}
            >
              Request New Link
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.gradient[0]} 0%, ${theme.gradient[1]} 100%)`
      }}
    >
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-6 right-6 z-50 transition-all duration-300 ${showToast ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}
        >
          <div 
            className="flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4"
            style={{
              backgroundColor: getToastColors().backgroundColor,
              borderLeftColor: getToastColors().borderLeftColor,
              border: `1px solid ${theme.border}`
            }}
          >
            <div
              className="rounded-full p-2"
              style={{
                backgroundColor: toastType === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"
              }}
            >
              {getToastIcon()}
            </div>
            <div className="flex-1">
              <p className="text-sm" style={{ color: theme.textPrimary }}>{toastMsg}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle className="w-5 h-5" style={{ color: theme.tertiary }} />
            </button>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
             style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000"
             style={{ backgroundColor: "rgba(5, 150, 105, 0.1)" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse delay-500"
             style={{ backgroundColor: "rgba(240, 253, 244, 0.3)" }}></div>
      </div>

      <div className="w-full max-w-md relative">
        <div 
          className="backdrop-blur-xl shadow-2xl rounded-3xl p-8 transform transition-all duration-700 hover:shadow-3xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${theme.border}20`
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div 
                className="p-3 rounded-2xl"
                style={{ backgroundColor: theme.secondary }}
              >
                <Coffee className="w-8 h-8" style={{ color: theme.primary }} />
              </div>
            </div>

            <h1 
              className="text-3xl font-bold mb-3"
              style={{
                background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryVariant})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Reset Password
            </h1>

            <p style={{ color: theme.tertiary }}>
              Enter your new password below to complete the reset process.
            </p>
          </div>

          <div className="space-y-6">
            {/* New Password Field */}
            <div className="group">
              <label 
                htmlFor="password" 
                className="font-medium mb-2 block"
                style={{ color: theme.textPrimary }}
              >
                New Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" 
                  style={{ color: theme.tertiary }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 h-14 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderColor: errors.password ? theme.error : theme.border,
                    color: theme.textPrimary
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      e.target.style.borderColor = theme.success
                      e.target.style.boxShadow = `0 0 0 2px rgba(16, 185, 129, 0.2)`
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.password) {
                      e.target.style.borderColor = theme.border
                      e.target.style.boxShadow = 'none'
                    }
                  }}
                  placeholder="Enter new password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors flex items-center gap-1"
                  style={{ color: theme.tertiary }}
                  onMouseEnter={(e) => e.target.style.color = theme.primaryVariant}
                  onMouseLeave={(e) => e.target.style.color = theme.tertiary}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span className="text-xs font-medium">{showPassword ? "Hide" : "Show"}</span>
                </button>
                {errors.password && (
                  <div className="flex items-center mt-2 text-sm" style={{ color: theme.error }}>
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.password.message}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label 
                htmlFor="confirmPassword" 
                className="font-medium mb-2 block"
                style={{ color: theme.textPrimary }}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" 
                  style={{ color: theme.tertiary }}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 h-14 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderColor: errors.confirmPassword ? theme.error : theme.border,
                    color: theme.textPrimary
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmPassword) {
                      e.target.style.borderColor = theme.success
                      e.target.style.boxShadow = `0 0 0 2px rgba(16, 185, 129, 0.2)`
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.confirmPassword) {
                      e.target.style.borderColor = theme.border
                      e.target.style.boxShadow = 'none'
                    }
                  }}
                  placeholder="Confirm new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors flex items-center gap-1"
                  style={{ color: theme.tertiary }}
                  onMouseEnter={(e) => e.target.style.color = theme.primaryVariant}
                  onMouseLeave={(e) => e.target.style.color = theme.tertiary}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span className="text-xs font-medium">{showConfirmPassword ? "Hide" : "Show"}</span>
                </button>
                {errors.confirmPassword && (
                  <div className="flex items-center mt-2 text-sm" style={{ color: theme.error }}>
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              className="w-full h-14 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ backgroundColor: theme.success }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.backgroundColor = theme.primaryVariant
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.target.style.backgroundColor = theme.success
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Resetting Password...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Reset Password</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>

            {/* Security Notice */}
            <div 
              className="mt-6 p-4 border rounded-xl"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgba(16, 185, 129, 0.3)"
              }}
            >
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.success }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.primary }}>
                    Password Security
                  </p>
                  <p className="text-xs mt-1" style={{ color: theme.primaryVariant }}>
                    Choose a strong password with at least 6 characters for better security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.border }}>
            <button
              onClick={() => showToastMessage("Redirecting to login...", "success")}
              className="flex items-center justify-center space-x-2 font-medium transition-colors group w-full"
              style={{ color: theme.primaryVariant }}
              onMouseEnter={(e) => e.target.style.color = theme.primary}
              onMouseLeave={(e) => e.target.style.color = theme.primaryVariant}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}