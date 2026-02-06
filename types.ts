
export interface Issue {
  id: string;
  title: string;
  source: string;
  severity: 'Low' | 'Medium' | 'High';
  image: string;
  category: string;
  location: string;
  tags: string[];
  trending?: boolean;
  aiAnalyzed?: boolean;
  aiConfidence?: number;
  status: 'Open' | 'Under Review' | 'Resolved';
  aiExplanation?: string[];
  verificationStatus?: 'Verified' | 'Warning' | 'Pending';
  impactScore?: number;
}

export interface ActivityEvent {
  id: string;
  type: 'REPORTED' | 'RESOLVED' | 'UNDER_REVIEW';
  user: string;
  issueTitle: string;
  severity?: string;
  timestamp: string;
}

export interface User {
  username: string;
  avatar: string;
  walletAddress: string;
}
