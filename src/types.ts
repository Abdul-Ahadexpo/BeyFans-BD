export interface Product {
  id: string;
  name: string;
  price: number;
  beforePrice?: number;
  description: string;
  category: string[];
  images: string[];
  youtubeVideoUrl?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  userName: string;
  text: string;
  images: string[];
  createdAt: Date;
}

export interface Settings {
  bannerImage: string;
  bannerText: string;
  bannerLink: string;
  backgroundImage: string;
  mobileBackgroundImage: string;
  whatsappLink: string;
  messengerLink: string;
  socialLinks: string[];
  adminPassword: string;
}

export interface Category {
  id: string;
  name: string;
  productIds: string[];
  image?: string;
  description?: string;
}