export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface Story {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  genres: string[];
  author: Author;
  views: number;
  likes: number;
  rating: number;
  createdAt: string;
  isFeatured?: boolean;
}
