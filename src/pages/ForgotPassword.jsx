import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Coffee, Mail, ArrowLeft, Send, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [toastType, setToastType] = useState("success") // success, error, info
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  // Theme colors from JSON
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

  const showToastMessage = (message, type = "success") => {
    setToastMsg(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 5000)
  }

  const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+$/i
    if (!email) {
      return "Email is required"
    }
    if (!emailRegex.test(email)) {
      return "Invalid email address"
    }
    return ""
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const error = validateEmail(email)
    setEmailError(error)
    
    if (error) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success - email sent
      setEmailSent(true)
      showToastMessage("Password reset email sent! Check your inbox.", "success")
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
      case "info":
        return <AlertCircle className="w-6 h-6 text-blue-600" />
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
      case "info":
        return {
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderLeftColor: "#3B82F6"
        }
      default:
        return {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderLeftColor: theme.success
        }
    }
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
                backgroundColor: toastType === "success" ? "rgba(16, 185, 129, 0.2)" : 
                                toastType === "error" ? "rgba(239, 68, 68, 0.2)" : 
                                "rgba(59, 130, 246, 0.2)"
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
              Forgot Password?
            </h1>

            {!emailSent ? (
              <p style={{ color: theme.tertiary }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            ) : (
              <p style={{ color: theme.tertiary }}>
                We've sent a password reset link to{" "}
                <span className="font-semibold" style={{ color: theme.primary }}>{email}</span>
              </p>
            )}
          </div>

          {!emailSent ? (
            /* Email Form */
            <div className="space-y-6">
              <div className="group">
                <label 
                  htmlFor="email" 
                  className="font-medium mb-2 block"
                  style={{ color: theme.textPrimary }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" 
                    style={{ color: theme.tertiary }}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError("")
                    }}
                    className="w-full pl-12 h-14 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderColor: emailError ? theme.error : theme.border,
                      color: theme.textPrimary
                    }}
                    onFocus={(e) => {
                      if (!emailError) {
                        e.target.style.borderColor = theme.success
                        e.target.style.boxShadow = `0 0 0 2px rgba(16, 185, 129, 0.2)`
                      }
                    }}
                    onBlur={(e) => {
                      if (!emailError) {
                        e.target.style.borderColor = theme.border
                        e.target.style.boxShadow = 'none'
                      }
                    }}
                    placeholder="your@email.com"
                  />
                  {emailError && (
                    <div className="flex items-center mt-2 text-sm" style={{ color: theme.error }}>
                      <XCircle className="w-4 h-4 mr-1" />
                      {emailError}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                onClick={onSubmit}
                className="w-full h-14 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  backgroundColor: theme.success
                }}
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
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </div>
                )}
              </button>
            </div>
          ) : (
            /* Success State */
            <div className="text-center space-y-6">
              <div 
                className="p-4 border rounded-xl"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderColor: "rgba(16, 185, 129, 0.3)"
                }}
              >
                <div className="flex items-center justify-center mb-3">
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                  >
                    <CheckCircle className="w-6 h-6" style={{ color: theme.success }} />
                  </div>
                </div>
                <p className="text-sm" style={{ color: theme.primary }}>
                  Check your email for the password reset link. It may take a few minutes to arrive.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm" style={{ color: theme.tertiary }}>
                  Didn't receive the email? Check your spam folder or
                </p>
                <button
                  onClick={() => {
                    setEmailSent(false)
                    setIsLoading(false)
                    setEmail("")
                    setEmailError("")
                  }}
                  className="w-full h-12 border-2 rounded-xl transition-all duration-300"
                  style={{
                    borderColor: theme.border,
                    color: theme.primaryVariant,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.secondary
                    e.target.style.borderColor = theme.success
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.borderColor = theme.border
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.border }}>
            <button
              onClick={() => navigate("/login")}
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