import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IMarketingBrief } from "../models/IMarketingBrief";

const LIST_TITLE = "MarketingBriefs";

const SELECT_FIELDS = [
  "Id", "Title", "Brand", "Season", "Year", "Priority",
  "DueDate", "GoLiveDate", "FigmaUrl", "RouteTCP", "RouteGYM", "RouteCopy",
  "CopyAssignedTo/Id", "CopyAssignedTo/Title", "CopyAssignedTo/EMail",
  "GymAssignedTo/Id", "GymAssignedTo/Title", "GymAssignedTo/EMail",
  "TCPAssignedTo/Id", "TCPAssignedTo/Title", "TCPAssignedTo/EMail",
  "CopyAssignedToId", "GymAssignedToId", "TCPAssignedToId",
  "AssetDetails", "Status",
];

const EXPAND_FIELDS = ["CopyAssignedTo", "GymAssignedTo", "TCPAssignedTo"];

export class MarketingBriefService {
  constructor(private sp: SPFI) {}

  private get list() {
    return this.sp.web.lists.getByTitle(LIST_TITLE);
  }

  public async getListId(): Promise<string> {
    const list = await this.list.select("Id")();
    return list.Id;
  }

  public async getItems(filter?: string): Promise<IMarketingBrief[]> {
    let query = this.list.items
      .select(...SELECT_FIELDS)
      .expand(...EXPAND_FIELDS)
      .top(500)
      .orderBy("DueDate", true);

    if (filter) {
      query = query.filter(filter);
    }

    return query() as Promise<IMarketingBrief[]>;
  }

  public async getItem(id: number): Promise<IMarketingBrief> {
    return this.list.items
      .getById(id)
      .select(...SELECT_FIELDS)
      .expand(...EXPAND_FIELDS)() as Promise<IMarketingBrief>;
  }

  public async createItem(item: Partial<IMarketingBrief>): Promise<IMarketingBrief> {
    const payload = this.buildPayload(item);
    const result = await this.list.items.add(payload);
    return result as unknown as IMarketingBrief;
  }

  public async updateItem(id: number, updates: Partial<IMarketingBrief>): Promise<void> {
    const payload = this.buildPayload(updates);
    await this.list.items.getById(id).update(payload);
  }

  public async deleteItem(id: number): Promise<void> {
    await this.list.items.getById(id).delete();
  }

  private buildPayload(item: Partial<IMarketingBrief>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    if (item.Title !== undefined) payload.Title = item.Title;
    if (item.Brand !== undefined) payload.Brand = item.Brand;
    if (item.Season !== undefined) payload.Season = item.Season;
    if (item.Year !== undefined) payload.Year = item.Year;
    if (item.Priority !== undefined) payload.Priority = item.Priority;
    if (item.DueDate !== undefined) payload.DueDate = item.DueDate;
    if (item.GoLiveDate !== undefined) payload.GoLiveDate = item.GoLiveDate;
    if (item.FigmaUrl !== undefined) payload.FigmaUrl = item.FigmaUrl || "";
    if (item.RouteTCP !== undefined) payload.RouteTCP = item.RouteTCP;
    if (item.RouteGYM !== undefined) payload.RouteGYM = item.RouteGYM;
    if (item.RouteCopy !== undefined) payload.RouteCopy = item.RouteCopy;
    if (item.CopyAssignedToId !== undefined) payload.CopyAssignedToId = item.CopyAssignedToId;
    if (item.GymAssignedToId !== undefined) payload.GymAssignedToId = item.GymAssignedToId;
    if (item.TCPAssignedToId !== undefined) payload.TCPAssignedToId = item.TCPAssignedToId;
    if (item.AssetDetails !== undefined) payload.AssetDetails = item.AssetDetails;
    if (item.Status !== undefined) payload.Status = item.Status;
    return payload;
  }
}
