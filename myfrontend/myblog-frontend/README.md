# 🌐 Blog-App Frontend

This is the frontend of the Blog-App, built with **React 19** and **Vite**. It provides a high-performance, responsive UI for reading and managing blog posts.

## 🚀 Key Features
- **Modern Interface**: Designed with Tailwind CSS 4 for a sleek, contemporary look.
- **State Management**: Powered by **Zustand** for efficient global state handling.
- **Dark Mode**: Built-in support for light/dark themes via `themeStore`.
- **Form Handling**: Integrated with **React Hook Form** for seamless user input.
- **Protected Routes**: Custom routing logic to secure user and admin areas.
- **Toast Notifications**: Interactive feedback for user actions.

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + Lucide Icons
- **State Store**: Zustand
- **Routing**: React Router 7
- **API Client**: Axios

## 🏃 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Directory Structure
- `src/components`: UI building blocks (Navbar, PostCard, etc.)
- `src/pages`: Main view components (HomePage, AdminDashboard, etc.)
- `src/store`: Zustand stores for Auth, Theme, and Posts.
- `src/services`: API abstraction layer.
- `src/styles`: Global CSS and Tailwind configurations.
