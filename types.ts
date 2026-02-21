
export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  thumbnail: string;
  previewUrl: string;
  videoUrl: string;
  description: string;
  aspect?: 'landscape' | 'portrait' | 'featured';
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  price: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  image: string;
  price: string;
  duration: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}
