const IMGBB_API_KEY = '2a78816b4b5cc1c4c3b18f8f258eda60';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export const uploadToImgbb = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  try {
    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.data.display_url;
  } catch (error) {
    console.error('Error uploading to Imgbb:', error);
    throw error;
  }
};

export const uploadMultipleToImgbb = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadToImgbb(file));
  return Promise.all(uploadPromises);
};