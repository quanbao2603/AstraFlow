export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'mod' | 'admin';
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: UserProfile;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  image?: string;
}
