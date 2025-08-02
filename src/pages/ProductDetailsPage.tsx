import React, { useState, useEffect } from 'react';
import { Product, Settings } from '../types';
import { getProduct, getSettings } from '../services/firebaseService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Package } from 'lucide-react';

interface ProductDetailsPageProps {
  productId: string;
  onBack: () => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId, onBack }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, settingsData] = await Promise.all([
          getProduct(productId),
          getSettings()
        ]);
        
        setProduct(productData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleWhatsAppOrder = () => {
    if (settings?.whatsappLink && product) {
      const message = `Hi! I'm interested in ordering: ${product.name} - ৳${product.price}`;
      window.open(`${settings.whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleMessengerOrder = () => {
    if (settings?.messengerLink) {
      window.open(settings.messengerLink, '_blank');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen gradient-dark pb-20 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto mobile-button"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark pb-20">
      <div className="container mx-auto px-4 py-6 mobile-padding">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 fade-in">
          <button
            onClick={onBack}
            className="p-3 glass-effect rounded-full hover:bg-gray-700 transition-all duration-300 mobile-button"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white text-shadow truncate">{product.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 fade-in">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative glass-effect rounded-2xl overflow-hidden">
              <img
                src={product.images[currentImageIndex] || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all mobile-button"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all mobile-button"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all mobile-button ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative rounded-lg overflow-hidden transition-all mobile-button ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-green-500 opacity-100' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <div className="space-y-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {product.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 gradient-primary text-white text-sm rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="text-4xl font-bold text-green-400">
                  ৳{product.price.toLocaleString()}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-white mb-3 text-lg">Description</h3>
                  <p className="text-gray-300 leading-relaxed text-base">
                    {product.description || 'No description available.'}
                  </p>
                </div>

                {/* Product Details */}
                <div className="border-t border-gray-600 pt-4">
                  <h3 className="font-semibold text-white mb-3 text-lg">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Product ID:</span>
                      <span className="text-gray-300 font-mono">{product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Added:</span>
                      <span className="text-gray-300">{product.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Images:</span>
                      <span className="text-gray-300">{product.images.length} photo{product.images.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Buttons */}
            <div className="space-y-3">
              {settings?.whatsappLink && (
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-semibold mobile-button card-hover"
                >
                  <MessageCircle className="w-6 h-6" />
                  Order via WhatsApp
                </button>
              )}
              
              {settings?.messengerLink && (
                <button
                  onClick={handleMessengerOrder}
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-semibold mobile-button card-hover"
                >
                  <MessageCircle className="w-6 h-6" />
                  Order via Messenger
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <h3 className="font-semibold text-white mb-3 text-lg">Need Help?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Have questions about this product? Contact us through WhatsApp or Messenger for instant support and detailed information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;