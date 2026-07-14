export interface Gem {
  id: number;
  title: string;
  category: string;
  area: string;
  isBookmarked: boolean;
  /** Number of up‑votes */
  upvotes: number;
}
