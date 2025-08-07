import React, { useState, useEffect } from 'react';
import { Product, Settings } from '../types';
import { getProduct, getSettings } from '../services/firebaseService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, ShoppingCart, MessageCircle, Star, Calendar, Hash, Image as ImageIcon, Play } from 'lucide-react';

interface ProductDetailsPageProps {
  productId: string;
  onBack: () => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId, onBack }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const loadProductAndSettings = async () => {
      if (!productId) return;
      
      setLoading(true);
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

    loadProductAndSettings();
  }, [productId]);

  const handleWhatsAppOrder = () => {
    if (!product || !settings?.whatsappLink) return;
    
    const message = `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: TK${product.currentPrice || product.price}\n\nPlease let me know about this product and delivery details.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`${settings.whatsappLink}?text=${encodedMessage}`, '_blank');
  };

  const handleMessengerOrder = () => {
    if (!settings?.messengerLink) return;
    window.open(settings.messengerLink, '_blank');
  };

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const truncateDescription = (text: string, maxLength: number = 369) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Product not found</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark text-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden aspect-square">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-green-500' : 'border-white/20'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image Indicators */}
            {product.images.length > 1 && (
              <div className="flex justify-center gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-green-500' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
              {product.category && product.category.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                {product.beforePrice && (
                   <span className="text-2xl text-[#d63c0d] line-through">
                     {product.beforePrice} TK
                   </span>
                )}
                <span className="text-3xl lg:text-4xl font-bold text-green-400">
                  {product.currentPrice || product.price} TK
                </span>
              </div>
                <span className="text-xs text-yellow-300">Price not fixed</span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {showFullDescription 
                    ? product.description 
                    : truncateDescription(product.description)
                  }
                  {product.description.length > 369 && !showFullDescription && '...'}
                </p>
                {product.description.length > 369 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3 text-green-400 hover:text-green-300 transition-colors font-medium"
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}

            {/* YouTube Video */}
            {product.youtubeVideoUrl && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Play className="w-5 h-5 text-red-500" />
                  Review Video
                </h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={product.youtubeVideoUrl.includes('embed') 
                      ? product.youtubeVideoUrl 
                      : product.youtubeVideoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                    }
                    title="Product Review Video"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">ID: {product.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">
                    Images: {product.images.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Buttons */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Order Now</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settings?.whatsappLink && (
                  <button
                    onClick={handleWhatsAppOrder}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 rounded-xl transition-colors font-semibold text-lg"
                  >
                    <MessageCircle className="w-6 h-6" />
                    WhatsApp Order
                  </button>
                )}
                {settings?.messengerLink && (
                  <button
                    onClick={handleMessengerOrder}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-semibold text-lg"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Messenger Order
                  </button>
                )}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
              <p className="text-gray-300 mb-4">
                Have questions about this product? Contact us for more information!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {settings?.whatsappLink && (
                  <a
                    href={settings.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Support
                  </a>
                )}
                {settings?.messengerLink && (
                  <a
                    href={settings.messengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Messenger Support
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;