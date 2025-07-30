import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import { getReviews } from '../services/firebaseService';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { MessageSquare, Search } from 'lucide-react';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsData = await getReviews();
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, searchQuery]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen gradient-dark pb-20">
      <div className="container mx-auto px-4 py-6 mobile-padding">
        {/* Header */}
        <div className="mb-6 fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 text-shadow">Customer Reviews</h1>
            <p className="text-gray-400">Real experiences from our customers</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 mobile-button"
            />
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <div className="space-y-6 fade-in">
            {filteredReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 fade-in">
            <div className="text-gray-500 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No Reviews Found' : 'No Reviews Yet'}
            </h3>
            <p className="text-gray-400">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Reviews will appear here once added by admin.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;