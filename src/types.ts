export interface GiftItem {
  id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  isInteractive?: boolean;
  tags: string[];
  bannerGradient: string;
  iconName: string;
  badge?: string;
}

export interface ReviewMessage {
  id: string;
  teacherName: string;
  school: string;
  rating: number;
  comment: string;
  date: string;
}
