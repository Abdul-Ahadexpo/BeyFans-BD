import React, { useState } from 'react';
import { Product } from '../types';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  whatsappLink?: string;
  messengerLink?: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose, 
  whatsappLink, 
  messengerLink 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleWhatsAppOrder = () => {
    if (whatsappLink) {
      const message = `Hi! I'm interested in ordering: ${product.name} - ${product.price}TK`;
      window.open(`${whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleMessengerOrder = () => {
    if (messengerLink) {
      window.open(messengerLink, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass-effect p-4 border-b border-gray-600 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white truncate">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-4">
          {/* Image Gallery */}
          <div className="relative mb-6">
            <img
              src={product.images[currentImageIndex] || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
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

            <div className="text-3xl font-bold text-green-400">
              {product.price}TK
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Order Buttons */}
            <div className="flex gap-3 pt-4">
              {whatsappLink && (
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 mobile-button"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </button>
              )}
              
              {messengerLink && (
                <button
                  onClick={handleMessengerOrder}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 mobile-button"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via Messenger
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;