# EduCore PH - School Management System

A modern, functional, and responsive School Management System built with React, TypeScript, and Vite.

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Specialized dashboards for Admin, Staff, and Students.
- **Messaging System**: Real-time communication between roles with persistent history.
- **Student Lifecycle**: Registration → Approval → Active status.
- **Branch Management**: Campus-based data filtering and control.
- **Teacher Evaluations**: Anonymous star-rating system for faculty.

---

## 🔑 Testing Credentials

Use the following credentials to test the system. **Universal Password: `password123`**

### 🏢 Admin Access
- **Super Admin**: `admin@educore.ph`

### 👥 Branch Demo Accounts

| Branch | Staff Account | Student Account |
| :--- | :--- | :--- |
| **Commonwealth** | `commonwealth.staff` | `commonwealth.student` |
| **Montalban** | `montalban.staff` | `montalban.student` |
| **Taytay** | `taytay.staff` | `taytay.student` |
| **Global Demo** | `staff@educore.ph` | `dave@gmail.com` |

> **Pro Tip**: Staff accounts automatically filter data to show only students from their respective branch.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS + Lucide Icons
- **State Management**: Zustand (with Persist Middleware)
- **UI Components**: Shadcn/UI

## 📦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run development server**:
   ```bash
   npm run dev
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```
