import React from 'react';
import { Product } from '../types';
import { Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  return (
    <div className="glass-effect rounded-xl overflow-hidden card-hover fade-in">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {product.category.map((cat, index) => (
            <span
              key={index}
              className="px-2 py-1 gradient-primary text-white text-xs rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
        
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-400">
            ৳{product.price}
          </span>
          
          <button
            onClick={() => onViewProduct(product)}
            className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 mobile-button"
          >
            <Eye className="w-4 h-4" />
            Show Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;