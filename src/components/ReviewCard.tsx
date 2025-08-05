import React, { useState } from 'react';
import { Review } from '../types';
import { User, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % review.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + review.images.length) % review.images.length);
  };

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

        {/* Review Images */}
        {review.images.length > 0 && (
          <div className="relative">
            <div 
              className="flex gap-2 overflow-x-auto pb-2"
              onMouseEnter={() => setShowImagePreview(true)}
              onMouseLeave={() => setShowImagePreview(false)}
            >
              {review.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <button
                    onClick={() => openImageModal(index)}
                    className="w-16 h-16 rounded-lg overflow-hidden hover:opacity-80 transition-all duration-300 hover:scale-105 border-2 border-gray-600 hover:border-green-500"
                  >
                    <img
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-full h-full object-cover bg-gray-800"
                    />
                  </button>
                  {index === 3 && review.images.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+{review.images.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Hover Preview */}
            {showImagePreview && review.images.length > 0 && (
              <div className="absolute top-0 left-0 z-20 bg-black bg-opacity-90 rounded-lg p-2 transform -translate-y-full mb-2">
                <div className="flex gap-1">
                  {review.images.slice(0, 3).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => openImageModal(index)}
                      className="w-20 h-20 rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {review.images.length > 3 && (
                    <div className="w-20 h-20 rounded-md bg-gray-700 flex items-center justify-center">
                      <span className="text-white text-xs">+{review.images.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Size Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="relative">
              <img
                src={review.images[currentImageIndex]}
                alt={`Review image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Navigation Arrows */}
              {review.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {review.images.length}
            </div>

            {/* Thumbnail Navigation */}
            {review.images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 max-w-full overflow-x-auto pb-2">
                {review.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-green-500 opacity-100' 
                        : 'border-gray-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;
