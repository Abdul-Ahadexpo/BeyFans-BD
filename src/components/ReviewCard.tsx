import React from 'react';
import { Review } from '../types';
import { User, Calendar } from 'lucide-react';
import ImageModal from './ImageModal';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  return (
    <>
      <div className="glass-effect rounded-xl p-6 card-hover">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{review.userName}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              {review.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed mb-4">{review.text}</p>

        {review.images.length > 0 && (
          <div className="relative">
            {review.images.length === 1 ? (
              <button
                onClick={() => setSelectedImage(review.images[0])}
                className="w-32 h-32 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
              >
                <img
                  src={review.images[0]}
                  alt="Review image"
                  className="w-full h-full object-cover bg-gray-800"
                />
              </button>
            ) : (
              <div className="relative w-32 h-32">
                {/* Stack of images */}
                {review.images.slice(0, 3).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`absolute rounded-lg overflow-hidden hover:opacity-80 transition-all duration-300 ${
                      index === 0 ? 'w-32 h-32 z-30' :
                      index === 1 ? 'w-28 h-28 top-2 left-2 z-20' :
                      'w-24 h-24 top-4 left-4 z-10'
                    }`}
                    style={{
                      transform: `rotate(${index * 3}deg)`,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <img
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-full h-full object-cover bg-gray-800"
                    />
                  </button>
                ))}
                {review.images.length > 3 && (
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full z-40">
                    +{review.images.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

export default ReviewCard;