export interface TopPerformer {
  staffName: string;
  date: string; // ISO format (e.g., "2025-04-18T00:00:00")
  servicesProvided: number;
  workedFor: number; // Revenue or earnings
}

export interface DashboardInsightsDto {
  mostUsedService: string;
  mostUsedServiceCount: number;
  leastUsedService: string;
  leastUsedServiceCount: number;
  bestPerformingBranch: string;
  topPerformersTimeline: TopPerformer[];
}
