# EduCore PH - School Management System

A modern, functional, and responsive School Management System built with React, TypeScript, and Vite.

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Specialized dashboards for Admin, Staff, and Students.
- **Messaging System**: Real-time communication between roles with persistent history.
- **Student Lifecycle**: Registration → Approval → Active status.
- **Branch Management**: Campus-based data filtering and control.
- **Teacher Evaluations**: Anonymous star-rating system for faculty.

---

## 🔑 Demo Access Center

Use the following credentials to test the system across different branches and roles. **Universal Password: `password123`**

### 🏢 Admin Access
- **Super Admin**: `admin@educore.ph` (Full control over all branches)

### 👥 Staff & Student Accounts (Branch Specific)

| Branch | Staff Account | Student Account |
| :--- | :--- | :--- |
| **Commonwealth (HQ)** | `commonwealth.staff@educore.ph` | `commonwealth.student@gmail.com` |
| **Montalban** | `montalban.staff@educore.ph` | `montalban.student@gmail.com` |
| **Taytay** | `taytay.staff@educore.ph` | `taytay.student@gmail.com` |
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
