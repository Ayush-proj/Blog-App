import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 🎨 THEME STORE
 * 
 * Manages dark/light mode across the entire app
 * Persists theme preference to localStorage
 */

export const useThemeStore = create(
  persist(
    (set) => ({
      // State
      isDarkMode: true, // Default to dark mode
      
      // Actions
      toggleTheme: () => set((state) => {
        const newMode = !state.isDarkMode;
        
        // Update HTML class for Tailwind dark mode
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        return { isDarkMode: newMode };
      }),
      
      setTheme: (isDark) => set(() => {
        // Update HTML class for Tailwind dark mode
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        return { isDarkMode: isDark };
      }),
    }),
    {
      name: 'theme-storage', // localStorage key
      onRehydrateStorage: () => (state) => {
        // Apply theme on page load
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
