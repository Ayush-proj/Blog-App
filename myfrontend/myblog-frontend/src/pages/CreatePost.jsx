import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * ✍️ CREATE POST PAGE - Using Direct Fetch
 * 
 * Allows logged-in users to create new blog posts
 * - Form with validation
 * - Image upload with preview
 * - Publish or save as draft
 * 
 * 🎓 LEARNING: This shows how to:
 * 1. Upload images using FormData
 * 2. Create posts with authentication
 * 3. Handle complex forms
 */

const CreatePostPage = () => {
  const navigate = useNavigate();
  const toast = useToastStore();
  const { token } = useAuthStore(); // Get token for authentication

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    published: true
  });

  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // UI states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Categories - Must match backend Post model enum exactly
  const categories = ['Technology','React', 'CSS', 'JavaScript', 'Node.js', 'MongoDB', 'Other'];

  /**
   * Handle text input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * 🎓 HANDLE IMAGE SELECTION
   * 
   * Validates image and creates preview
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🎓 Validate image manually (instead of using uploadService)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG, or GIF)');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Set file and create preview
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Remove selected image
   */
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 🎓 HANDLE FORM SUBMISSION - Using Direct Fetch
   * 
   * This is complex! We need to:
   * 1. Upload image first (if selected)
   * 2. Then create post with image URL
   * 3. Both require authentication
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      // 🎓 STEP 1: Upload image if selected
      let imageUrl = '';
      if (imageFile) {
        setUploadingImage(true);
        
        // Create FormData for file upload
        const formDataImage = new FormData();
        formDataImage.append('image', imageFile);

        // Upload image
        const uploadResponse = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}` // Auth required
            // Don't set Content-Type - browser does it for FormData
          },
          body: formDataImage
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.data.url; // Access nested data.url
        setUploadingImage(false);
      }

      // 🎓 STEP 2: Prepare post data
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published: formData.published,
        image: imageUrl
      };

      // 🎓 STEP 3: Create post
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Auth required
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      const data = await response.json();

      // 🎓 STEP 4: Success!
      toast.success(
        formData.published 
          ? 'Post published successfully!' 
          : 'Post saved as draft!'
      );

      // 🎓 STEP 5: Redirect to the new post
      navigate(`/blog/${data._id}`);

    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
            <Input
              label="Post Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter an engaging title..."
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.content 
                  ? 'border-red-500' 
                  : 'border-gray-300 dark:border-slate-600'
              }`}
              placeholder="Write your post content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.content.length} characters
            </p>
          </div>

          {/* Category & Tags */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category 
                    ? 'border-red-500' 
                    : 'border-gray-300 dark:border-slate-600'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
              <Input
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, javascript, tutorial"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Click to upload image
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {uploadingImage && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-white text-sm text-center mt-1">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Publish Toggle */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">
                Publish immediately
              </span>
            </label>
            <p className="mt-2 text-sm text-gray-500">
              {formData.published 
                ? 'Post will be visible to everyone' 
                : 'Post will be saved as draft'}
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {formData.published ? 'Publish Post' : 'Save as Draft'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/blog')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
