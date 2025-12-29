/**
 * 💀 SKELETON LOADING COMPONENTS
 * 
 * Beautiful loading placeholders that show while content loads
 * Uses shimmer animation for professional look
 */

// Base Skeleton Component
export const Skeleton = ({ className = "" }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-slate-800 rounded ${className}`}
      aria-label="Loading..."
    />
  );
};

// Skeleton for Blog Card
export const BlogCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-800">
      {/* Image skeleton */}
      <Skeleton className="h-56 w-full rounded-none" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Category and date */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        
        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Blog Post Page
export const BlogPostSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-4/5" />
        
        {/* Author info */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      
      {/* Featured image */}
      <Skeleton className="h-96 w-full mb-8" />
      
      {/* Content */}
      <div className="space-y-4 mb-12">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};

// Skeleton for Comment
export const CommentSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

// Skeleton for Dashboard Stats
export const DashboardStatSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-24 mb-2" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
};

// Skeleton for Profile
export const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-8">
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          
          {/* Form fields */}
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
