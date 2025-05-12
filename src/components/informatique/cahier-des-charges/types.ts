export interface SpecificationType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
}

export interface SpecificationStatisticsType {
  total: number;
  draft: number;
  review: number;
  approved: number;
  archived: number;
}
