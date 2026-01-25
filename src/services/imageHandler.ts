/**
 * Professional Image Handler Service
 * Handles image upload, processing, and display for ID verification
 */

export interface ImageUploadResponse {
  success: boolean;
  path: string;
  filename: string;
  size: number;
  error?: string;
}

export interface ImageDisplayOptions {
  size?: 'thumbnail' | 'small' | 'medium' | 'large';
  rounded?: boolean;
  border?: boolean;
  blur?: boolean;
}

class ImageHandlerService {
  private readonly API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  /**
   * Upload image file to server
   */
  async uploadImage(file: File, token: string): Promise<ImageUploadResponse> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, path: '', filename: '', size: 0, error: validation.error };
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch(`${this.API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          path: '',
          filename: '',
          size: 0,
          error: error.error || 'Upload failed',
        };
      }

      const data = await response.json();
      return {
        success: true,
        path: data.data.path,
        filename: data.data.filename,
        size: data.data.size,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload error';
      return {
        success: false,
        path: '',
        filename: '',
        size: 0,
        error: message,
      };
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Max size is ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload JPG, PNG, or WebP',
      };
    }

    return { valid: true };
  }

  /**
   * Get optimized image URL with size and quality parameters
   */
  getOptimizedUrl(
    imagePath: string,
    options: ImageDisplayOptions = {}
  ): string {
    const { size = 'medium' } = options;

    const sizeMap = {
      thumbnail: 'w=100&h=100',
      small: 'w=200&h=200',
      medium: 'w=400&h=400',
      large: 'w=600&h=600',
    };

    let url = `${this.API_URL}${imagePath}`;

    // Add query parameters for optimization
    const params = [
      sizeMap[size],
      'q=85', // Quality
      'f=auto', // Auto format
    ];

    if (url.includes('?')) {
      url += '&' + params.join('&');
    } else {
      url += '?' + params.join('&');
    }

    return url;
  }

  /**
   * Generate data URL from file for preview
   */
  async generatePreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Compress image before upload
   */
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

// Export singleton instance
export const imageHandler = new ImageHandlerService();
