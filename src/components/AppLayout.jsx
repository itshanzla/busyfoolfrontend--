"use client"

import { useState } from "react"
import { useTheme } from "../contexts/ThemeContext"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"

export default function AppLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const { isDarkMode } = useTheme()

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-theme-background" : "bg-theme-background"
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 space-y-6">{children}</main>
      </div>
    </div>
  )
}
