import { 
  ref, 
  push, 
  set, 
  get, 
  remove, 
  update,
  query,
  orderByChild,
  orderByKey,
  limitToLast,
  onValue,
  off
} from 'firebase/database';
import { database } from '../firebase';
import { Product, Review, Settings, Category } from '../types';

// Products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    
    if (snapshot.exists()) {
      const productsData = snapshot.val();
      return Object.keys(productsData)
        .map(key => ({
          id: key,
          ...productsData[key],
          category: productsData[key].category || [],
          images: productsData[key].images || [],
          beforePrice: productsData[key].beforePrice || undefined,
          youtubeVideoUrl: productsData[key].youtubeVideoUrl || undefined,
          createdAt: new Date(productsData[key].createdAt)
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const productRef = ref(database, `products/${id}`);
    const snapshot = await get(productRef);
    
    if (snapshot.exists()) {
      const productData = snapshot.val();
      return {
        id,
        ...productData,
        category: productData.category || [],
        images: productData.images || [],
        beforePrice: productData.beforePrice || undefined,
        youtubeVideoUrl: productData.youtubeVideoUrl || undefined,
        createdAt: new Date(productData.createdAt)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const productsRef = ref(database, 'products');
    const newProductRef = push(productsRef);
    
    await set(newProductRef, {
      ...product,
      createdAt: new Date().toISOString()
    });
    
    return newProductRef.key!;
  } catch (error) {
    console.error('Error adding product:', error);
    if (error instanceof Error && error.message.includes('PERMISSION_DENIED')) {
      throw new Error('PERMISSION_DENIED: Firebase Realtime Database rules are blocking write access. Please update your database rules in Firebase Console.');
    }
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  try {
    const productRef = ref(database, `products/${id}`);
    await update(productRef, product);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = ref(database, `products/${id}`);
    await remove(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Reviews
export const getReviews = async (): Promise<Review[]> => {
  try {
    const reviewsRef = ref(database, 'reviews');
    const snapshot = await get(reviewsRef);
    
    if (snapshot.exists()) {
      const reviewsData = snapshot.val();
      return Object.keys(reviewsData)
        .map(key => ({
          id: key,
          ...reviewsData[key],
          images: reviewsData[key].images || [],
          createdAt: new Date(reviewsData[key].createdAt)
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const reviewsRef = ref(database, 'reviews');
    const newReviewRef = push(reviewsRef);
    
    await set(newReviewRef, {
      ...review,
      createdAt: new Date().toISOString()
    });
    
    return newReviewRef.key!;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    const reviewRef = ref(database, `reviews/${id}`);
    await remove(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Settings
export const getSettings = async (): Promise<Settings | null> => {
  try {
    const settingsRef = ref(database, 'settings');
    const snapshot = await get(settingsRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as Settings;
    } else {
      // Create default settings if they don't exist
      const defaultSettings: Settings = {
        adminPassword: 'admin1234',
        bannerImage: '',
        bannerText: '',
        bannerLink: '',
        backgroundImage: '',
        mobileBackgroundImage: '',
        whatsappLink: '',
        messengerLink: '',
        socialLinks: []
      };
      try {
        await set(settingsRef, defaultSettings);
      } catch (writeError) {
        console.warn('Could not write default settings to Firebase:', writeError);
      }
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    // Return default settings if there's an error
    return {
      adminPassword: 'admin1234',
      bannerImage: '',
      bannerText: '',
      bannerLink: '',
      backgroundImage: '',
      mobileBackgroundImage: '',
      whatsappLink: '',
      messengerLink: '',
      socialLinks: []
    };
  }
};

export const updateSettings = async (settings: Partial<Settings>): Promise<void> => {
  try {
    const settingsRef = ref(database, 'settings');
    await update(settingsRef, settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = ref(database, 'categories');
    const snapshot = await get(categoriesRef);
    
    if (snapshot.exists()) {
      const categoriesData = snapshot.val();
      return Object.keys(categoriesData).map(key => ({
        id: key,
        ...categoriesData[key],
        productIds: categoriesData[key].productIds || []
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  try {
    const categoriesRef = ref(database, 'categories');
    const newCategoryRef = push(categoriesRef);
    
    await set(newCategoryRef, category);
    return newCategoryRef.key!;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
  try {
    const categoryRef = ref(database, `categories/${id}`);
    await update(categoryRef, category);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = ref(database, `categories/${id}`);
    await remove(categoryRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
