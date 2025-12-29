import { create } from "zustand"

export const useAppStore = create((set) => ({
  // Navigation state
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),

  // User state
  user: {
    id: 1,
    name: "Alex Johnson",
    email: "alex@blogsite.com",
    bio: "Passionate developer and tech writer sharing knowledge about web development.",
    avatar: "/images/professional-avatar.png",
    joinDate: "2023-01-15",
  },
  updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

  // Blog posts state
  blogPosts: [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      excerpt: "Learn how to use React Hooks to manage state and side effects in your functional components.",
      content:
        "React Hooks have revolutionized how we write React components. They allow you to use state and other React features without writing a class. In this comprehensive guide, we'll explore useState, useEffect, and custom hooks...",
      author: "Alex Johnson",
      date: "2024-11-15",
      category: "React",
      readTime: "8 min read",
      image:"src/images/post1.png",
      views: 2850,
    },
    {
      id: 2,
      title: "Mastering Tailwind CSS Grid Layouts",
      excerpt: "Discover how to create responsive and flexible layouts using Tailwind CSS grid utilities.",
      content:
        "Tailwind CSS provides powerful grid utilities that make it easy to create complex layouts. Let's dive into how to use grid-cols, grid-rows, and responsive breakpoints to build stunning interfaces...",
      author: "Alex Johnson",
      date: "2024-11-10",
      category: "CSS",
      readTime: "10 min read",
      image:"src/images/post2.jpg",
      views: 1920,
    },
    {
      id: 3,
      title: "State Management with Zustand vs Redux",
      excerpt: "A detailed comparison of two popular state management solutions for React applications.",
      content:
        "Choosing the right state management tool can significantly impact your project. Zustand offers simplicity while Redux provides powerful middleware. Let's compare them side by side...",
      author: "Alex Johnson",
      date: "2024-11-05",
      category: "JavaScript",
      readTime: "12 min read",
      image:"src/images/post3.jpg",
      views: 3200,
    },
  ],
  addPost: (post) =>
    set((state) => ({
      blogPosts: [...state.blogPosts, { ...post, id: Date.now() }],
    })),

    
  updatePost: (id, updatedPost) =>
    set((state) => ({
      blogPosts: state.blogPosts.map((p) => (p.id === id ? { ...p, ...updatedPost } : p)),
    })),


    // updatePost:(id,updatePost)=>
    //   set((state)=>({
    //     blogPosts:state.blogPosts.map((p)=>(p.id ===id ?{...p,...updatePost}:p)),
    //   })),

  // Dashboard state
  dashboardStats: {
    totalPosts: 3,
    totalViews: 7971,
    totalReaders: 1240,
  },

  // Contact messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: Date.now(), date: new Date().toISOString() }],
    })),
}))
