import { SPFI } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMarketingBriefProps {
  sp: SPFI;
  context: WebPartContext;
}
