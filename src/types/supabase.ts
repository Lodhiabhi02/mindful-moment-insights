
export type JournalEntry = {
  id: string;
  user_id: string;
  text: string;
  sentiment_score: number | null;
  emotions: {
    joy: number;
    sadness: number;
    fear: number;
    anger: number;
    love: number;
    surprise: number;
  } | null;
  recommendations: string[] | null;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};
