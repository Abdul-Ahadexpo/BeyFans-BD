import React, { useState, useEffect } from 'react';
import { Product, Category, Settings } from '../types';
import { getProducts, getCategories, getSettings } from '../services/firebaseService';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, Package } from 'lucide-react';

interface ProductsPageProps {
  onProductSelect: (productId: string) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData, settingsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getSettings()
        ]);
        
        // Shuffle products for random order on each reload
        const shuffledProducts = productsData.sort(() => Math.random() - 0.5);
        setProducts(shuffledProducts);
        setCategories(categoriesData);
        setSettings(settingsData);
        setFilteredProducts(shuffledProducts);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category.includes(selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const allCategories = ['All', ...categories.map(cat => cat.name)];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen gradient-dark pb-20">
      <div className="container mx-auto px-4 py-6 mobile-padding">
        {/* Header */}
        <div className="mb-6 fade-in">
          <h1 className="text-3xl font-bold text-white mb-4 text-shadow">Our Products</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 mobile-button"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 mobile-button"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-4 p-4 glass-effect rounded-lg slide-up">
              <h3 className="font-semibold text-white mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mobile-button ${
                      selectedCategory === category
                        ? 'gradient-primary text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={() => onProductSelect(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 fade-in">
            <div className="text-gray-500 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;