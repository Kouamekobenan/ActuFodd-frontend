export interface DashboardOverview {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalAdmins: number;
  totalCategories: number;
  totalTags: number;
}

export interface PostSummary {
  id: string;
  title: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  mediaUrl: string | null;
  category?: { id: string; name: string };
  publishedAt: string;
}

export interface CategoryCount {
  id: string;
  name: string;
  count: number;
}

export interface RecentComment {
  id: string;
  content: string;
  createdAt: string;
  admin?: { id: string; name: string };
  post?: { id: string; title: string };
}

export interface DashboardStats {
  overview: DashboardOverview;
  posts: {
    byMediaType: { IMAGE: number; VIDEO: number; TEXT: number };
    byCategory: CategoryCount[];
    topViewed: PostSummary[];
    topLiked: PostSummary[];
    recentlyPublished: PostSummary[];
  };
  activity: {
    postsThisWeek: number;
    postsThisMonth: number;
    commentsThisWeek: number;
    likesThisWeek: number;
  };
  recentComments: RecentComment[];
}
