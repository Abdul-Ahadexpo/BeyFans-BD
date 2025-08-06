import React, { useState, useEffect } from 'react';
import { Product, Review, Settings, Category } from '../types';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getReviews,
  addReview,
  deleteReview,
  getSettings,
  updateSettings,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { uploadToImgbb } from '../services/imgbbService';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Package, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Tag,
  LogOut,
  HelpCircle,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  Smartphone,
  Monitor,
  Youtube,
  DollarSign
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Product form
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    beforePrice: 0,
    description: '',
    category: [] as string[],
    images: [] as string[],
    youtubeVideoUrl: ''
  });

  // Review form
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    text: '',
    images: [] as string[]
  });

  // Category form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    productIds: [] as string[]
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    bannerImage: '',
    bannerText: '',
    bannerLink: '',
    backgroundImage: '',
    mobileBackgroundImage: '',
    whatsappLink: '',
    messengerLink: '',
    socialLinks: [] as string[],
    adminPassword: ''
  });

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [uploadingMobileBackground, setUploadingMobileBackground] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, reviewsData, categoriesData, settingsData] = await Promise.all([
        getProducts(),
        getReviews(),
        getCategories(),
        getSettings()
      ]);
      
      setProducts(productsData);
      setReviews(reviewsData);
      setCategories(categoriesData);
      setSettings(settingsData);
      
      if (settingsData) {
        setSettingsForm({
          bannerImage: settingsData.bannerImage || '',
          bannerText: settingsData.bannerText || '',
          bannerLink: settingsData.bannerLink || '',
          backgroundImage: settingsData.backgroundImage || '',
          mobileBackgroundImage: settingsData.mobileBackgroundImage || '',
          whatsappLink: settingsData.whatsappLink || '',
          messengerLink: settingsData.messengerLink || '',
          socialLinks: settingsData.socialLinks || [],
          adminPassword: settingsData.adminPassword || 'admin1234'
        });
      }
    } catch (error) {
      showNotification('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: 0,
      beforePrice: 0,
      description: '',
      category: [],
      images: [],
      youtubeVideoUrl: ''
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const resetReviewForm = () => {
    setReviewForm({
      userName: '',
      text: '',
      images: []
    });
    setEditingReview(null);
    setShowReviewForm(false);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      productIds: []
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || productForm.price <= 0) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
        showNotification('success', 'Product updated successfully');
      } else {
        await addProduct(productForm);
        showNotification('success', 'Product added successfully');
      }
      resetProductForm();
      loadData();
    } catch (error) {
      showNotification('error', 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.userName.trim() || !reviewForm.text.trim()) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await addReview(reviewForm);
      showNotification('success', 'Review added successfully');
      resetReviewForm();
      loadData();
    } catch (error) {
      showNotification('error', 'Failed to add review');
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showNotification('error', 'Please enter category name');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        showNotification('success', 'Category updated successfully');
      } else {
        await addCategory(categoryForm);
        showNotification('success', 'Category added successfully');
      }
      resetCategoryForm();
      loadData();
    } catch (error) {
      showNotification('error', 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settingsForm);
      showNotification('success', 'Settings updated successfully');
      loadData();
    } catch (error) {
      showNotification('error', 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(id);
      showNotification('success', 'Product deleted successfully');
      loadData();
    } catch (error) {
      showNotification('error', 'Failed to delete product');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(id);
      showNotification('success', 'Review deleted successfully');
      loadData();
    } catch (error) {
      showNotification('error', 'Failed to delete review');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await deleteCategory(id);
      showNotification('success', 'Category deleted successfully');
      loadData();
    } catch (error) {
      showNotification('error', 'Failed to delete category');
    }
  };

  const editProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      price: product.price,
      beforePrice: product.beforePrice || 0,
      description: product.description,
      category: product.category,
      images: product.images,
      youtubeVideoUrl: product.youtubeVideoUrl || ''
    });
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const editCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      productIds: category.productIds
    });
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleImageUpload = async (file: File, type: 'banner' | 'background' | 'mobileBackground') => {
    const setUploading = type === 'banner' ? setUploadingBanner : 
                        type === 'background' ? setUploadingBackground : 
                        setUploadingMobileBackground;
    
    setUploading(true);
    try {
      const imageUrl = await uploadToImgbb(file);
      setSettingsForm(prev => ({
        ...prev,
        [type === 'banner' ? 'bannerImage' : 
         type === 'background' ? 'backgroundImage' : 
         'mobileBackgroundImage']: imageUrl
      }));
      showNotification('success', `${type} image uploaded successfully`);
    } catch (error) {
      showNotification('error', `Failed to upload ${type} image`);
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'products', icon: Package, label: 'Products', count: products.length },
    { id: 'reviews', icon: MessageSquare, label: 'Reviews', count: reviews.length },
    { id: 'categories', icon: Tag, label: 'Categories', count: categories.length },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'How to Use' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-effect border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-600' :
          notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`}>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {notification.type === 'info' && <Info className="w-5 h-5" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'gradient-primary text-white shadow-lg'
                    : 'glass-effect text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Manage Products</h2>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              {/* Product Form */}
              {showProductForm && (
                <div className="glass-effect rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button
                      onClick={resetProductForm}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Categories
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {categories.map(category => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                const isSelected = productForm.category.includes(category.name);
                                setProductForm(prev => ({
                                  ...prev,
                                  category: isSelected
                                    ? prev.category.filter(c => c !== category.name)
                                    : [...prev.category, category.name]
                                }));
                              }}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                productForm.category.includes(category.name)
                                  ? 'gradient-primary text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Current Price (TK) *
                        </label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Before Price (TK) - Optional
                        </label>
                        <input
                          type="number"
                          value={productForm.beforePrice}
                          onChange={(e) => setProductForm(prev => ({ ...prev, beforePrice: Number(e.target.value) }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Youtube className="w-4 h-4 inline mr-1" />
                        YouTube Video URL - Optional
                      </label>
                      <input
                        type="url"
                        value={productForm.youtubeVideoUrl}
                        onChange={(e) => setProductForm(prev => ({ ...prev, youtubeVideoUrl: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        rows={4}
                        placeholder="Enter product description"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Product Images
                      </label>
                      <ImageUpload
                        images={productForm.images}
                        onImagesChange={(images) => setProductForm(prev => ({ ...prev, images }))}
                        maxImages={6}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <div key={product.id} className="glass-effect rounded-xl p-4">
                    <div className="aspect-video bg-gray-800 rounded-lg mb-3 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {product.beforePrice && product.beforePrice > 0 && (
                        <span className="text-sm text-gray-400 line-through">{product.beforePrice}TK</span>
                      )}
                      <span className="text-lg font-bold text-green-400">{product.price}TK</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Manage Reviews</h2>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Review
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="glass-effect rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Add New Review</h3>
                    <button
                      onClick={resetReviewForm}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        value={reviewForm.userName}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, userName: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder="Enter customer name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Review Text *
                      </label>
                      <textarea
                        value={reviewForm.text}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        rows={4}
                        placeholder="Enter review text"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Review Images
                      </label>
                      <ImageUpload
                        images={reviewForm.images}
                        onImagesChange={(images) => setReviewForm(prev => ({ ...prev, images }))}
                        maxImages={4}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Add Review
                      </button>
                      <button
                        type="button"
                        onClick={resetReviewForm}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="glass-effect rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{review.userName}</h3>
                        <p className="text-sm text-gray-400">{review.createdAt.toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 mb-3">{review.text}</p>
                    {review.images.length > 0 && (
                      <div className="flex gap-2">
                        {review.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ))}
                        {review.images.length > 3 && (
                          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-white text-sm">
                            +{review.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Manage Categories</h2>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {/* Category Form */}
              {showCategoryForm && (
                <div className="glass-effect rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <button
                      onClick={resetCategoryForm}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder="Enter category name"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {editingCategory ? 'Update Category' : 'Add Category'}
                      </button>
                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Categories List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="glass-effect rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editCategory(category)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {category.productIds.length} products
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">App Settings</h2>

              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                {/* Banner Settings */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Banner Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Banner Image
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={settingsForm.bannerImage}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, bannerImage: e.target.value }))}
                          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                          placeholder="Banner image URL"
                        />
                        <label className="flex items-center gap-2 px-4 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all cursor-pointer">
                          {uploadingBanner ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
                            className="hidden"
                            disabled={uploadingBanner}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Banner Text
                      </label>
                      <input
                        type="text"
                        value={settingsForm.bannerText}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, bannerText: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder="Banner text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Banner Link
                      </label>
                      <input
                        type="url"
                        value={settingsForm.bannerLink}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, bannerLink: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder="Banner link URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Background Settings */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Background Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Monitor className="w-4 h-4 inline mr-1" />
                        Desktop Background Image
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={settingsForm.backgroundImage}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, backgroundImage: e.target.value }))}
                          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                          placeholder="Desktop background image URL"
                        />
                        <label className="flex items-center gap-2 px-4 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all cursor-pointer">
                          {uploadingBackground ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'background')}
                            className="hidden"
                            disabled={uploadingBackground}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Smartphone className="w-4 h-4 inline mr-1" />
                        Mobile Background Image
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={settingsForm.mobileBackgroundImage}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, mobileBackgroundImage: e.target.value }))}
                          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                          placeholder="Mobile background image URL (vertical)"
                        />
                        <label className="flex items-center gap-2 px-4 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all cursor-pointer">
                          {uploadingMobileBackground ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'mobileBackground')}
                            className="hidden"
                            disabled={uploadingMobileBackground}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Settings */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        WhatsApp Link
                      </label>
                      <input
                        type="url"
                        value={settingsForm.whatsappLink}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsappLink: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder="https://wa.me/1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Messenger Link
                      </label>
                      <input
                        type="url"
                        value={settingsForm.messengerLink}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, messengerLink: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder="https://m.me/yourpage"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settingsForm.adminPassword}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, adminPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                        placeholder="Admin password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Settings
                </button>
              </form>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">How to Use Admin Panel</h2>
              
              <div className="space-y-6">
                {/* Getting Started */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Getting Started
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p>Welcome to your Beyblade store admin panel! This guide will help you manage your store effectively.</p>
                    <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                      <p className="text-blue-300"><strong>Important:</strong> Always save your changes before switching tabs or logging out.</p>
                    </div>
                  </div>
                </div>

                {/* Products Management */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-400" />
                    Managing Products
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Adding a New Product:</h4>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Click the "Add Product" button</li>
                        <li>Fill in the product name (required)</li>
                        <li>Select categories by clicking on them</li>
                        <li>Set the current price (required)</li>
                        <li>Optionally set a "before price" for discounts</li>
                        <li>Add a YouTube video URL for product reviews</li>
                        <li>Write a detailed description</li>
                        <li>Upload product images (up to 6)</li>
                        <li>Click "Add Product" to save</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Pricing Tips:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Use "Before Price" to show discounts (crossed out)</li>
                        <li>All prices automatically show "Not fixed price"</li>
                        <li>Prices are displayed in Bangladeshi Taka (৳/TK)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-2">YouTube Videos:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Paste any YouTube URL format (watch?v=, youtu.be/, embed)</li>
                        <li>Videos will appear on the product details page</li>
                        <li>Great for product reviews and demonstrations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Reviews Management */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    Managing Reviews
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Adding Customer Reviews:</h4>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Click "Add Review" button</li>
                        <li>Enter the customer's name</li>
                        <li>Write the review text</li>
                        <li>Upload review images (up to 4)</li>
                        <li>Click "Add Review" to publish</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Review Image Features:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Small thumbnails display on review cards</li>
                        <li>Hover over images for quick preview</li>
                        <li>Click images to view full size</li>
                        <li>Professional stacked display for multiple images</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Categories Management */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-orange-400" />
                    Managing Categories
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Creating Categories:</h4>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Click "Add Category" button</li>
                        <li>Enter a descriptive category name</li>
                        <li>Click "Add Category" to save</li>
                        <li>Categories will appear when adding/editing products</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Category Examples:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Attack Type, Defense Type, Stamina Type</li>
                        <li>Metal Fight, Burst, X Series</li>
                        <li>Launchers, Accessories, Parts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Settings Management */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-red-400" />
                    App Settings
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Banner Settings:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Upload banner image or paste URL</li>
                        <li>Add banner text for promotions</li>
                        <li>Set banner link for call-to-action</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Background Images:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Desktop:</strong> Use landscape/horizontal images</li>
                        <li><strong>Mobile:</strong> Use portrait/vertical images</li>
                        <li>Upload directly or paste image URLs</li>
                        <li>Images automatically switch based on device</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-2">Contact Settings:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>WhatsApp:</strong> Format: https://wa.me/8801234567890</li>
                        <li><strong>Messenger:</strong> Format: https://m.me/yourpagename</li>
                        <li>These links appear on product pages for orders</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Image Upload Guide */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-cyan-400" />
                    Image Upload Guide
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Direct Upload (Recommended):</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Click "Upload" buttons to select images from your device</li>
                        <li>Images are automatically uploaded to Imgbb</li>
                        <li>No need for external image hosting</li>
                        <li>Supports JPG, PNG, GIF formats</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Image Best Practices:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Product Images:</strong> Square or landscape, high quality</li>
                        <li><strong>Review Images:</strong> Any size, will be displayed as thumbnails</li>
                        <li><strong>Banner:</strong> Wide landscape format (1200x400px recommended)</li>
                        <li><strong>Background:</strong> High resolution, not too busy</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Mobile Optimization */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-pink-400" />
                    Mobile Optimization Tips
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Admin Panel on Mobile:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Horizontal scrolling tabs for easy navigation</li>
                        <li>Touch-friendly buttons and forms</li>
                        <li>Optimized layouts for small screens</li>
                        <li>All features work perfectly on phones</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Customer Experience:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Separate mobile background images</li>
                        <li>Responsive product grids</li>
                        <li>Touch-friendly product cards</li>
                        <li>Optimized image viewing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    Pro Tips for Success
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Product Management:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Use high-quality, well-lit product photos</li>
                        <li>Write detailed, engaging descriptions</li>
                        <li>Add YouTube videos for better engagement</li>
                        <li>Use "before price" to highlight discounts</li>
                        <li>Organize products with relevant categories</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Customer Reviews:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Add authentic customer reviews regularly</li>
                        <li>Include photos of products in use</li>
                        <li>Respond to customer feedback</li>
                        <li>Use reviews to build trust</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-2">Store Optimization:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Update banner regularly with promotions</li>
                        <li>Use attractive background images</li>
                        <li>Keep contact information up to date</li>
                        <li>Test on mobile devices regularly</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Troubleshooting
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Common Issues:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Images not loading:</strong> Check internet connection, try re-uploading</li>
                        <li><strong>Changes not saving:</strong> Ensure all required fields are filled</li>
                        <li><strong>YouTube video not showing:</strong> Use direct YouTube URLs</li>
                        <li><strong>Mobile layout issues:</strong> Clear browser cache</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Best Practices:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Save your work frequently</li>
                        <li>Test changes on different devices</li>
                        <li>Keep backup of important images</li>
                        <li>Use strong admin password</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
