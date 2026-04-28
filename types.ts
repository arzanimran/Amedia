export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Post {
  id: number;
  user_id: number;
  media_url: string;
  media_type: string;
  caption: string;
  created_at: string;
}