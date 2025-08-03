import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { getSettings } from '../services/firebaseService';
import { ExternalLink, MessageCircle, Package, MessageSquare, Zap, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await getSettings();
        if (settingsData) {
          setSettings(settingsData);
        } else {
          // Fallback to default settings if getSettings returns null
          setSettings({
            adminPassword: 'admin1234',
            bannerImage: '',
            bannerText: '',
            bannerLink: '',
            backgroundImage: '',
            whatsappLink: '',
            messengerLink: '',
            socialLinks: []
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Set default settings if loading fails
        setSettings({
          adminPassword: 'admin1234',
          bannerImage: '',
          bannerText: '',
          bannerLink: '',
          backgroundImage: '',
          whatsappLink: '',
          messengerLink: '',
          socialLinks: []
        });
      }
    };

    loadSettings();
  }, []);

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pb-20 relative" style={{
      backgroundImage: settings?.backgroundImage ? `url(${settings.backgroundImage})` : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {settings?.backgroundImage && (
        <div className="absolute inset-0 backdrop-blur-custom bg-black bg-opacity-60"></div>
      )}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8 mobile-padding">
          {/* Banner Section */}
          {settings?.bannerImage && settings.bannerImage.trim() !== '' && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl fade-in">
              <div className="relative">
                <img
                  src={settings.bannerImage}
                  alt="Banner"
                  className="w-full h-64 md:h-80 object-cover"
                  onError={(e) => {
                    console.error('Banner image failed to load:', settings.bannerImage);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  {settings.bannerText && settings.bannerText.trim() !== '' && (
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-shadow">{settings.bannerText}</h2>
                  )}
                  {settings.bannerLink && settings.bannerLink.trim() !== '' && (
                    <button
                      onClick={() => window.open(settings.bannerLink, '_blank')}
                      className="inline-flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 mobile-button"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Learn More
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="text-center mb-12 slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow">
              Welcome to BeyFans BD
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed text-shadow mobile-text">
              Your ultimate destination for premium Beyblade collections, accessories, and community reviews. 
              Discover the latest releases and join the battle!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 fade-in">
            {settings?.whatsappLink && (
              <div className="glass-effect rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">WhatsApp Orders</h3>
                    <p className="text-gray-300">Quick and easy ordering</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(settings.whatsappLink, '_blank')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold mobile-button"
                >
                  Chat with us on WhatsApp
                </button>
              </div>
            )}

            {settings?.messengerLink && (
              <div className="glass-effect rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Messenger</h3>
                    <p className="text-gray-300">Connect via Facebook</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(settings.messengerLink, '_blank')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold mobile-button"
                >
                  Message us on Facebook
                </button>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in">
            <div className="glass-effect rounded-2xl p-6 text-center card-hover">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-custom">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Products</h3>
              <p className="text-gray-300">Top Quality Beyblade Products at the Best Prices - Just for You!</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center card-hover">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-custom">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Beyfane BD Community Reviews</h3>
              <p className="text-gray-300">Authentic Reviews From Varified Customers</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center card-hover">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-custom">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-300">Quick & Secure Delivery All Over Bangladesh</p>
            </div>
          </div>

          {/* Social Links */}
          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div className="text-center fade-in">
              <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
              <div className="flex justify-center gap-4">
                {settings.socialLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleSocialClick(link)}
                    className="w-12 h-12 glass-effect rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 mobile-button"
                  >
                    <ExternalLink className="w-6 h-6 text-white" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
