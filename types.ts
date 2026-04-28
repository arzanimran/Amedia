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

  // 👇 JOINED USER DATA (IMPORTANT)
  username?: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  text: string;
  username?: string;
  avatar?: string;
  created_at: string;
}