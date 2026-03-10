declare interface IMarketingBriefWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module "MarketingBriefWebPartStrings" {
  const strings: IMarketingBriefWebPartStrings;
  export = strings;
}
