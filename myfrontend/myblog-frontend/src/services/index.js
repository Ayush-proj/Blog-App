/**
 * 📦 SERVICES INDEX
 * 
 * Central export point for all services
 * Makes imports cleaner throughout the app
 * 
 * Usage:
 * import { authService, postService } from '@/services';
 */

export { default as api } from './api';
export { default as authService } from './authService';
export { default as postService } from './postService';
export { default as commentService } from './commentService';
export { default as uploadService } from './uploadService';
