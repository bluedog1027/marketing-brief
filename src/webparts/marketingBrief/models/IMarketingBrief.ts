export interface IMarketingBriefUser {
  Id: number;
  Title: string;
  EMail: string;
}

export interface IMarketingBrief {
  Id: number;
  Title: string;
  Brand: string;
  Season: string;
  Year: string;
  Priority: string;
  DueDate: string;
  GoLiveDate: string;
  FigmaUrl: string;
  RouteTCP: boolean;
  RouteGYM: boolean;
  RouteCopy: boolean;
  CopyAssignedTo: IMarketingBriefUser | null;
  CopyAssignedToId: number | null;
  GymAssignedTo: IMarketingBriefUser | null;
  GymAssignedToId: number | null;
  TCPAssignedTo: IMarketingBriefUser | null;
  TCPAssignedToId: number | null;
  AssetDetails: string;
  Status: string;
}
