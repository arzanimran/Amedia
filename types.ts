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
  username: string;

  media_url: string;
  media_type: string;
  caption?: string;

  created_at: string;

  // 👇 ADD THESE (important fixes)
  avatar?: string;
  is_liked?: boolean;
  like_count?: number;
  comment_count?: number;
}

export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  text: string;
  created_at: string;
  username?: string;
  avatar?: string;
}