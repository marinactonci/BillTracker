# 💰 Bill Tracker - Personal Finance Management Solution

<div align="center">

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://rachuni.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**A modern, intuitive web application for tracking and managing your personal bills and expenses**

[🚀 Live Demo](https://rachuni.vercel.app/) • [📱 New Version (Fiskalio)](https://github.com/marinactonci/Fiskalio)

</div>

---

## 🎯 About The Project

Bill Tracker is a comprehensive personal finance management application designed to simplify bill tracking and expense management. Built with modern web technologies, it provides users with an intuitive interface to monitor due dates, payment history, and upcoming financial obligations.

> **🆕 New Version Available!**
> Check out [**Fiskalio**](https://github.com/marinactonci/Fiskalio) - the enhanced and updated version of this application with improved features and better performance.

### ✨ Key Features

- 📅 **Smart Bill Tracking** - Monitor due dates, payment history, and upcoming bills
- 🔐 **Secure Authentication** - User registration and login with Supabase Auth
- 📱 **Responsive Design** - Seamless experience across all devices and screen sizes
- 🎨 **Modern UI/UX** - Clean, intuitive interface built with Tailwind CSS and Ant Design
- ⚡ **Real-time Updates** - Instant synchronization with Supabase backend
- 🏷️ **Smart Categorization** - Organize bills by type, priority, and custom categories
- 📊 **Dashboard Analytics** - Visual insights into your spending patterns
- 🌐 **Multi-language Support** - Available in multiple languages

---

## 🛠️ Tech Stack

<div align="center">

| Frontend                                                                                                          | Backend                                                                                                     | Database                                                                                                          | Styling                                                                                                                | Deployment                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)        | ![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)  | ![Supabase](https://img.shields.io/badge/Supabase_Auth-181818?style=for-the-badge&logo=supabase&logoColor=white)  | ![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)       |                                                                                                       |

</div>

### 🏗️ Architecture & Technologies

- **🖥️ Frontend Framework**: Next.js 14 with App Router for optimal performance and SEO
- **📝 Language**: TypeScript for type safety and better developer experience
- **🎨 Styling**: Tailwind CSS for utility-first styling + Ant Design for UI components
- **🗄️ Backend & Database**: Supabase for real-time database, authentication, and API
- **🔐 Authentication**: Supabase Auth with email/password and social providers
- **☁️ Deployment**: Vercel for seamless deployment and hosting

---

## 🚀 Getting Started

### 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control

### ⚡ Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/marinactonci/BillTracker.git
   cd BillTracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SECRET_KEY=your-encryption-secret-key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running! 🎉

### 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

---

## 📁 Project Structure

```
BillTracker/
├── 📁 app/                    # Next.js App Router
│   ├── 📄 layout.tsx         # Root layout component
│   ├── 📄 page.tsx           # Home page
│   ├── 📁 bills/             # Bills management pages
│   ├── 📁 calendar/          # Calendar view
│   ├── 📁 dashboard/         # User dashboard
│   ├── 📁 login/             # Authentication pages
│   ├── 📁 register/          # User registration
│   └── 📁 user-profile/      # Profile management
├── 📁 components/            # Reusable React components
│   ├── 📄 bill.tsx          # Bill component
│   ├── 📄 calendar.tsx      # Calendar component
│   ├── 📄 navbar.tsx        # Navigation component
│   └── 📄 ...               # Other UI components
├── 📁 lib/                  # Core libraries and configurations
│   └── 📄 supabaseClient.ts # Supabase client setup
├── 📁 types/                # TypeScript type definitions
│   ├── 📄 bill.ts           # Bill-related types
│   ├── 📄 user.ts           # User-related types
│   └── 📄 ...               # Other type definitions
├── 📁 utils/                # Utility functions and helpers
│   ├── 📄 authUtils.ts      # Authentication utilities
│   ├── 📄 encryption.ts     # Data encryption helpers
│   └── 📄 supabaseUtils.ts  # Database utilities
├── 📁 public/               # Static assets and images
└── 📄 package.json          # Project dependencies and scripts
```

### 🏗️ Architecture Overview

- **App Router**: Utilizes Next.js 14's new App Router for improved performance and developer experience
- **Component-Based**: Modular, reusable React components for maintainable code
- **Type Safety**: Full TypeScript implementation for robust development
- **Utility Functions**: Centralized helper functions for common operations
- **Asset Management**: Organized static assets including images and icons

---

## 🌟 Features Overview

### 💳 Bill Management

- Create, edit, and delete bills with detailed information
- Set recurring option for each bill
- Track payment history and due dates

### 📊 Dashboard & Analytics

- Visual overview of upcoming bills and payments
- Monthly and yearly spending insights
- Payment status tracking (paid, pending, overdue)
- Quick access to recent activities

### 📅 Calendar Integration

- Interactive calendar view of all bills and due dates
- Monthly, weekly, and daily views
- Visual indicators for different bill types and statuses
- Quick bill creation from calendar interface

### 👤 User Management

- Secure user authentication and registration
- Profile customization and settings
- Data encryption for sensitive information

---

## 🆕 What's New?

This project has evolved into **[Fiskalio](https://github.com/marinactonci/Fiskalio)** - a more advanced and feature-rich version with:

- 🚀 Enhanced performance and optimization
- 🎨 Improved user interface and experience
- 📱 Better mobile responsiveness
- 🔧 Additional features and functionality
- 🛡️ Enhanced security measures

**[➡️ Check out Fiskalio here](https://github.com/marinactonci/Fiskalio)**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

--

## 🔗 Links

- **Live Demo**: [https://fiskalio.vercel.app](https://rachuni.vercel.app)
- **Portfolio**: [https://www.marinactonci.com/](https://www.marinactonci.com/)
- **LinkedIn**: [https://www.linkedin.com/in/marinactonci/](https://www.linkedin.com/in/marinactonci/)
