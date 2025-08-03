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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {review.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className="w-full rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img
                src={image}
                alt={`Review ${index + 1}`}
                className="w-full aspect-square object-contain bg-gray-800"
              />
            </button>
          ))}
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
