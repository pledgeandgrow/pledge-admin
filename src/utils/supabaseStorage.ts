import { createClient } from '@/lib/supabase';

// Initialize Supabase client
const supabase = createClient();

// Bucket names for different file types
const DOCUMENTS_BUCKET = 'documents';
const IMAGES_BUCKET = 'images';

// Helper function to ensure buckets exist
const ensureBucketExists = async (bucketName: string) => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 1024 * 1024 * 10 // 10MB limit
      });
      console.log(`Created bucket: ${bucketName}`);
    }
    return true;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
};

// Generate a unique file name to avoid collisions
const generateUniqueFileName = (originalName: string) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// File upload function
const uploadFile = async (bucketName: string, file: File, folder: string = '') => {
  try {
    await ensureBucketExists(bucketName);
    
    const uniqueFileName = generateUniqueFileName(file.name);
    const filePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error(`Error uploading file to ${bucketName}:`, error);
      return { success: false, error };
    }
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return { 
      success: true, 
      path: filePath,
      url: publicUrl,
      fileName: uniqueFileName,
      originalName: file.name,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error(`Error in uploadFile:`, error);
    return { success: false, error };
  }
};

// File deletion function
const deleteFile = async (bucketName: string, filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error(`Error deleting file ${filePath} from ${bucketName}:`, error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error in deleteFile:`, error);
    return { success: false, error };
  }
};

// List files in a bucket/folder
const listFiles = async (bucketName: string, folder: string = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder);
    
    if (error) {
      console.error(`Error listing files in ${bucketName}/${folder}:`, error);
      return { success: false, error };
    }
    
    return { success: true, files: data };
  } catch (error) {
    console.error(`Error in listFiles:`, error);
    return { success: false, error };
  }
};

// Export the storage functions
export const fileStorage = {
  // For backward compatibility with existing code
  readInternalProjects: async () => {
    console.warn('readInternalProjects is deprecated, use database queries instead');
    return [];
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeInternalProjects: async (projects: Record<string, string | number | boolean | null | string[] | Record<string, unknown>>[]) => {
    console.warn('writeInternalProjects is deprecated, use database queries instead');
    return false;
  },
  readClientProjects: async () => {
    console.warn('readClientProjects is deprecated, use database queries instead');
    return [];
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeClientProjects: async (projects: Record<string, string | number | boolean | null | string[] | Record<string, unknown>>[]) => {
    console.warn('writeClientProjects is deprecated, use database queries instead');
    return false;
  },
  
  // New file storage functions
  uploadDocument: async (file: File, folder: string = '') => {
    return await uploadFile(DOCUMENTS_BUCKET, file, folder);
  },
  deleteDocument: async (filePath: string) => {
    return await deleteFile(DOCUMENTS_BUCKET, filePath);
  },
  listDocuments: async (folder: string = '') => {
    return await listFiles(DOCUMENTS_BUCKET, folder);
  },
  
  uploadImage: async (file: File, folder: string = '') => {
    return await uploadFile(IMAGES_BUCKET, file, folder);
  },
  deleteImage: async (filePath: string) => {
    return await deleteFile(IMAGES_BUCKET, filePath);
  },
  listImages: async (folder: string = '') => {
    return await listFiles(IMAGES_BUCKET, folder);
  }
};
