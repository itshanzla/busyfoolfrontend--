"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coffee, User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiClient } from "@/lib/api"

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [toastType, setToastType] = useState("success") // success, error, warning

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  // Show toast with auto-hide
  const showToastMessage = (message, type = "success") => {
    setToastMsg(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const registerResponse = await apiClient.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "owner", // or set dynamically if needed
      })

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json()
        showToastMessage(errorData.message || "Registration failed", "error")
        setIsLoading(false)
        return
      }

      const user = await registerResponse.json()
      if (user.id) {
        localStorage.setItem("userId", user.id)
      }

      showToastMessage("Registration successful! Logging you in...", "success")

      const loginResponse = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      })

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json()
        showToastMessage(errorData.message || "Login after registration failed", "error")
        setIsLoading(false)
        return
      }

      const loginUser = await loginResponse.json()
      if (loginUser.accessToken) {
        localStorage.setItem("accessToken", loginUser.accessToken)
      }

      // Registration and login successful, redirect to welcome page
      showToastMessage("Welcome! Redirecting to dashboard...", "success")
      localStorage.setItem("loginSuccess", "1")

      // Delay redirect to show toast
      setTimeout(() => {
        window.location.href = "/welcome"
      }, 1500)
    } catch (error) {
      showToastMessage("Network error occurred. Please try again.", "error")
      setIsLoading(false)
    }
  }

  const password = watch("password", "")

  // Enhanced Toast Component
  const Toast = () => (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-8 right-8 z-50 max-w-md"
        >
          <div
            className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-lg ${
              toastType === "success"
                ? "border-emerald-200 bg-gradient-to-r from-emerald-50/90 to-green-50/90 shadow-emerald-100/50"
                : toastType === "error"
                  ? "border-red-200 bg-gradient-to-r from-red-50/90 to-rose-50/90 shadow-red-100/50"
                  : "border-amber-200 bg-gradient-to-r from-amber-50/90 to-yellow-50/90 shadow-amber-100/50"
            }`}
          >
            <div
              className={`rounded-full p-2.5 shadow-md ${
                toastType === "success" 
                  ? "bg-gradient-to-br from-emerald-100 to-green-200" 
                  : toastType === "error" 
                    ? "bg-gradient-to-br from-red-100 to-rose-200" 
                    : "bg-gradient-to-br from-amber-100 to-yellow-200"
              }`}
            >
              {toastType === "success" ? (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              ) : toastType === "error" ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-bold text-lg ${
                toastType === "success" 
                  ? "text-emerald-800" 
                  : toastType === "error" 
                    ? "text-red-800" 
                    : "text-amber-800"
              }`}>
                {toastType === "success" ? "Success!" : toastType === "error" ? "Error" : "Warning"}
              </p>
              <p className="text-gray-700 font-medium">{toastMsg}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="p-2 hover:bg-white/60 rounded-full transition-all duration-200 hover:scale-110"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <Toast />

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-200/25 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-200/10 to-emerald-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Additional floating elements */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-4 h-4 bg-emerald-400/20 rounded-full"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 120, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-32 left-32 w-6 h-6 bg-green-400/15 rounded-full"
        ></motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl relative"
      >
        <div className="bg-white/95 backdrop-blur-2xl shadow-2xl border border-green-200/50 rounded-3xl overflow-hidden grid lg:grid-cols-2 transform transition-all duration-700 hover:shadow-3xl hover:border-green-300/60">
          {/* Left Side – Enhanced Brand Section */}
          <div className="relative bg-gradient-to-br from-green-800 via-emerald-700 to-green-900 text-white p-16 flex flex-col justify-center space-y-10 overflow-hidden">
            {/* Enhanced decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/15 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/25 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-green-400/20 to-transparent rounded-full blur-xl"></div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                  <Coffee className="w-10 h-10 text-emerald-200" />
                </div>
                <div className="w-16 h-1.5 bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 rounded-full shadow-lg"></div>
              </div>

              <h1 className="text-6xl font-black leading-tight bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent mb-6">
                Create Your Account
              </h1>

              <p className="text-xl text-emerald-100/90 leading-relaxed mb-10 font-medium">
                Register to access your business dashboard and manage your operations with cutting-edge analytics and insights.
              </p>

              <div className="space-y-5">
                {[
                  "Real-time analytics & reporting",
                  "Advanced operational insights", 
                  "Enterprise-grade security"
                ].map((feature, index) => (
                  <motion.div 
                    key={feature}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4 text-emerald-100/90"
                  >
                    <div className="p-1.5 bg-emerald-400/20 rounded-full">
                      <CheckCircle className="w-5 h-5 text-emerald-300" />
                    </div>
                    <span className="font-semibold">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative z-10 pt-10 border-t border-white/20"
            >
              <p className="text-emerald-200/80 mb-4 font-medium">Already have an account?</p>
              <a
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl text-white font-bold hover:bg-white/25 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
              >
                Sign in instead
              </a>
            </motion.div>
          </div>

          {/* Right Side – Enhanced Form Section */}
          <div className="p-16 bg-gradient-to-br from-white/95 to-green-50/30 backdrop-blur-sm">
            <div className="max-w-lg mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center mb-10"
              >
                <h2 className="text-4xl font-black bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent mb-4">
                  Create Account
                </h2>
                <p className="text-gray-600 font-medium text-lg">Join thousands of successful business owners</p>
              </motion.div>

              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-8"
              >
                {/* Enhanced Name Field */}
                <div className="group">
                  <Label htmlFor="name" className="text-gray-800 font-bold mb-3 block text-base">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-emerald-600 transition-all duration-300" />
                    <Input
                      id="name"
                      className={`pl-14 h-16 bg-white/80 border-2 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:bg-white hover:bg-white/90 focus:shadow-lg text-lg font-medium ${
                        errors.name ? "border-red-400 focus:border-red-500 shadow-red-100" : "border-gray-200 focus:shadow-emerald-100"
                      }`}
                      placeholder="Enter your full name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center mt-3 text-red-600 text-sm font-semibold"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {errors.name.message}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Enhanced Email Field */}
                <div className="group">
                  <Label htmlFor="email" className="text-gray-800 font-bold mb-3 block text-base">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-emerald-600 transition-all duration-300" />
                    <Input
                      id="email"
                      type="email"
                      className={`pl-14 h-16 bg-white/80 border-2 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:bg-white hover:bg-white/90 focus:shadow-lg text-lg font-medium ${
                        errors.email ? "border-red-400 focus:border-red-500 shadow-red-100" : "border-gray-200 focus:shadow-emerald-100"
                      }`}
                      placeholder="your@email.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center mt-3 text-red-600 text-sm font-semibold"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {errors.email.message}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Enhanced Password Field */}
                <div className="group">
                  <Label htmlFor="password" className="text-gray-800 font-bold mb-3 block text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-emerald-600 transition-all duration-300" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`pl-14 pr-16 h-16 bg-white/80 border-2 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:bg-white hover:bg-white/90 focus:shadow-lg text-lg font-medium ${
                        errors.password ? "border-red-400 focus:border-red-500 shadow-red-100" : "border-gray-200 focus:shadow-emerald-100"
                      }`}
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-all duration-300 flex items-center gap-2 hover:scale-110"
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      <span className="text-sm font-bold text-gray-600">{showPassword ? "Hide" : "Show"}</span>
                    </button>
                    {errors.password && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center mt-3 text-red-600 text-sm font-semibold"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {errors.password.message}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Enhanced Confirm Password Field */}
                <div className="group">
                  <Label htmlFor="confirmPassword" className="text-gray-800 font-bold mb-3 block text-base">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-emerald-600 transition-all duration-300" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`pl-14 pr-16 h-16 bg-white/80 border-2 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:bg-white hover:bg-white/90 focus:shadow-lg text-lg font-medium ${
                        errors.confirmPassword ? "border-red-400 focus:border-red-500 shadow-red-100" : "border-gray-200 focus:shadow-emerald-100"
                      }`}
                      placeholder="Confirm your password"
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) => value === password || "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-all duration-300 flex items-center gap-2 hover:scale-110"
                    >
                      {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      <span className="text-sm font-bold text-gray-600">{showConfirmPassword ? "Hide" : "Show"}</span>
                    </button>
                    {errors.confirmPassword && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center mt-3 text-red-600 text-sm font-semibold"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {errors.confirmPassword.message}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xl font-black rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.form>

              {/* Enhanced Terms */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center text-sm text-gray-600 mt-8 font-medium"
              >
                By creating an account, you agree to our{" "}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-bold underline transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-bold underline transition-colors">
                  Privacy Policy
                </a>
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}