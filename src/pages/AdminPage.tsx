import React, { useState, useEffect } from 'react';
import { Product, Review, Settings, Category } from '../types';
import { 
  getProducts, 
  getReviews, 
  getSettings, 
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteReview,
  updateSettings,
  addCategory,
  updateCategory,
  deleteCategory
} from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
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
  LogOut
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'categories' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    category: [] as string[],
    images: [] as string[]
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    productIds: [] as string[]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, reviewsData, settingsData, categoriesData] = await Promise.all([
          getProducts(),
          getReviews(),
          getSettings(),
          getCategories()
        ]);
        
        setProducts(productsData);
        setReviews(reviewsData);
        setSettings(settingsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    try {
      const productId = await addProduct(newProduct);
      const addedProduct: Product = {
        id: productId,
        ...newProduct,
        createdAt: new Date()
      };
      
      setProducts([addedProduct, ...products]);
      setNewProduct({ name: '', price: 0, description: '', category: [], images: [] });
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, editingProduct);
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review.');
    }
  };

  const handleUpdateSettings = async (updatedSettings: Partial<Settings>) => {
    try {
      await updateSettings(updatedSettings);
      setSettings({ ...settings, ...updatedSettings } as Settings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      const categoryId = await addCategory(newCategory);
      const addedCategory: Category = {
        id: categoryId,
        ...newCategory
      };
      
      setCategories([...categories, addedCategory]);
      setNewCategory({ name: '', productIds: [] });
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen gradient-dark pb-20">
      <div className="container mx-auto px-4 py-6 mobile-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white text-shadow">Admin Panel</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 mobile-button"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
            { id: 'categories', icon: Tag, label: 'Categories' },
            { id: 'settings', icon: SettingsIcon, label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'gradient-primary text-white shadow-lg'
                  : 'glass-effect text-gray-300 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Products Management</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 mobile-button"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <div className="glass-effect rounded-xl p-6 slide-up">
                <h3 className="text-xl font-bold text-white mb-4">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price (৳)
                      </label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      rows={3}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white resize-none mobile-button"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <label key={category.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newProduct.category.includes(category.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProduct({
                                  ...newProduct,
                                  category: [...newProduct.category, category.name]
                                });
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  category: newProduct.category.filter(c => c !== category.name)
                                });
                              }
                            }}
                            className="rounded border-gray-600 focus:ring-green-500 bg-gray-800"
                          />
                          <span className="text-sm text-gray-300">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Images
                    </label>
                    <ImageUpload
                      images={newProduct.images}
                      onImagesChange={(images) => setNewProduct({ ...newProduct, images })}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 gradient-primary text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 mobile-button"
                    >
                      Add Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300 mobile-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
              {products.map(product => (
                <div key={product.id} className="glass-effect rounded-xl overflow-hidden card-hover">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2">{product.name}</h3>
                    <p className="text-green-400 font-bold text-xl mb-2">৳{product.price}</p>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 gradient-primary text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mobile-button"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 mobile-button"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Reviews Management</h2>
            
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="glass-effect rounded-xl p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{review.userName}</h3>
                      <p className="text-sm text-gray-400">{review.createdAt.toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300 mobile-button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{review.text}</p>
                  
                  {review.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
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
              <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
              <button
                onClick={() => setShowAddCategory(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-black mb-4">Add New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Category
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div key={category.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this category?')) {
                            try {
                              await deleteCategory(category.id);
                              setCategories(categories.filter(c => c.id !== category.id));
                            } catch (error) {
                              console.error('Error deleting category:', error);
                              alert('Failed to delete category.');
                            }
                          }
                        }}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {category.productIds.length} products
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Settings Management</h2>
            
            <div className="glass-effect rounded-xl p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Banner Text
                  </label>
                  <input
                    type="text"
                    value={settings.bannerText || ''}
                    onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Banner Link
                  </label>
                  <input
                    type="url"
                    value={settings.bannerLink || ''}
                    onChange={(e) => setSettings({ ...settings, bannerLink: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    WhatsApp Link
                  </label>
                  <input
                    type="url"
                    value={settings.whatsappLink || ''}
                    onChange={(e) => setSettings({ ...settings, whatsappLink: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Messenger Link
                  </label>
                  <input
                    type="url"
                    value={settings.messengerLink || ''}
                    onChange={(e) => setSettings({ ...settings, messengerLink: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={settings.adminPassword || ''}
                    onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdateSettings(settings)}
                  className="w-full gradient-primary text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mobile-button"
                >
                  <Save className="w-5 h-5" />
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="glass-effect rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 glass-effect p-4 border-b border-gray-600 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Product</h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price (৳)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white mobile-button"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      rows={3}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white resize-none mobile-button"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <label key={category.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingProduct.category.includes(category.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingProduct({
                                  ...editingProduct,
                                  category: [...editingProduct.category, category.name]
                                });
                              } else {
                                setEditingProduct({
                                  ...editingProduct,
                                  category: editingProduct.category.filter(c => c !== category.name)
                                });
                              }
                            }}
                            className="rounded border-gray-600 focus:ring-green-500 bg-gray-800"
                          />
                          <span className="text-sm text-gray-300">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Images
                    </label>
                    <ImageUpload
                      images={editingProduct.images}
                      onImagesChange={(images) => setEditingProduct({ ...editingProduct, images })}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 gradient-primary text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 mobile-button"
                    >
                      Update Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300 mobile-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;