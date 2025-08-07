import React, { useState, useEffect } from "react";
import { Settings, Category } from "../types";
import { getSettings, getCategories } from "../services/firebaseService";
import {
  ExternalLink,
  MessageCircle,
  PackageCheck,
  UsersRound,
  Truck,
  Shield,
} from "lucide-react";

const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, categoriesData] = await Promise.all([
          getSettings(),
          getCategories()
        ]);
        
        if (settingsData) {
          setSettings(settingsData);
        } else {
          // Fallback to default settings if getSettings returns null
          setSettings({
            adminPassword: "admin1234",
            bannerImage: "",
            bannerText: "",
            bannerLink: "",
            backgroundImage: "",
            mobileBackgroundImage: "",
            whatsappLink: "",
            messengerLink: "",
            socialLinks: [],
          });
        }
        
        // Filter categories that have both image and description
        const featuredCategories = categoriesData.filter(cat => cat.image && cat.description);
        setCategories(featuredCategories);
      } catch (error) {
        console.error("Error loading data:", error);
        // Set default settings if loading fails
        setSettings({
          adminPassword: "admin1234",
          bannerImage: "",
          bannerText: "",
          bannerLink: "",
          backgroundImage: "",
          mobileBackgroundImage: "",
          whatsappLink: "",
          messengerLink: "",
          socialLinks: [],
        });
      }
    };

    loadData();
  }, []);

  const handleSocialClick = (url: string) => {
    window.open(url, "_blank");
  };

  const getBackgroundStyle = () => {
    if (settings?.backgroundImage || settings?.mobileBackgroundImage) {
      const isMobile = window.innerWidth <= 768;
      const bgImage =
        isMobile && settings?.mobileBackgroundImage
          ? settings.mobileBackgroundImage
          : settings?.backgroundImage;

      if (bgImage) {
        return {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        };
      }
    }
    return {
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    };
  };

  return (
    <div className="min-h-screen pb-20 relative" style={getBackgroundStyle()}>
      {(settings?.backgroundImage || settings?.mobileBackgroundImage) && (
        <div className="absolute inset-0 backdrop-blur-custom bg-black bg-opacity-60"></div>
      )}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8 mobile-padding">
          {/* Banner Section */}
          {settings?.bannerImage && settings.bannerImage.trim() !== "" && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl fade-in">
              <div className="relative">
                <img
                  src={settings.bannerImage}
                  alt="Banner"
                  className="w-full h-64 md:h-80 object-cover"
                  onError={(e) => {
                    console.error(
                      "Banner image failed to load:",
                      settings.bannerImage
                    );
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  {settings.bannerText && settings.bannerText.trim() !== "" && (
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-shadow">
                      {settings.bannerText}
                    </h2>
                  )}
                  {settings.bannerLink && settings.bannerLink.trim() !== "" && (
                    <button
                      onClick={() => window.open(settings.bannerLink, "_blank")}
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
             Get Better Than You Expect
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed text-shadow mobile-text">
              Buy & Get Your Favourite Beyblade Products From BeyFans BD at Best Price and Create Your Best Beyblade Collection!
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
                    <h3 className="text-xl font-bold text-white">
                      WhatsApp Orders
                    </h3>
                    <p className="text-gray-300">Quick and easy ordering</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(settings.whatsappLink, "_blank")}
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
                  onClick={() => window.open(settings.messengerLink, "_blank")}
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
                <PackageCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Better Products
              </h3>
              <p className="text-gray-300">
                Top Quality Beyblade Products at the Best Prices Just for You ✓
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center card-hover">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-custom">
                <UsersRound className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
               Our Community Reviews
              </h3>
              <p className="text-gray-300">
              Honest Reviews From Real Customers
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center card-hover">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-custom">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-300">
                Safe and Secure Delivery All Over Bangladesh
              </p>
            </div>
          </div>

          {/* Category Cards */}
          {categories.length > 0 && (
            <div className="mb-12 fade-in">
              <h2 className="text-3xl font-bold text-white mb-8 text-center text-shadow">
                Shop by Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.slice(0, 3).map(category => (
                  <div key={category.id} className="glass-effect rounded-2xl overflow-hidden card-hover">
                    {category.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          onError={(e) => {
                            console.error('Category image failed to load:', category.image);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1 text-shadow">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      {!category.image && (
                        <h3 className="text-xl font-bold text-white mb-3 text-center">
                          {category.name}
                        </h3>
                      )}
                      {category.description && (
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          {category.description}
                        </p>
                      )}
                      <button
                        onClick={() => window.location.hash = 'products'}
                        className="w-full gradient-primary text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold mobile-button"
                      >
                        Explore {category.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
