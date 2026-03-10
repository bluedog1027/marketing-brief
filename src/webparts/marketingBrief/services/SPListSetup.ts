import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/views";

const LIST_TITLE = "MarketingBriefs";

export class SPListSetup {
  constructor(private sp: SPFI) {}

  public async listsExist(): Promise<boolean> {
    try {
      await this.sp.web.lists.getByTitle(LIST_TITLE).select("Id")();
      return true;
    } catch {
      return false;
    }
  }

  private async ensureField(fn: () => Promise<any>): Promise<void> {
    try {
      await fn();
    } catch {
      // Field likely already exists — safe to ignore
    }
  }

  public async runSetup(): Promise<void> {
    // Create or ensure the list exists (idempotent)
    await this.sp.web.lists.ensure(LIST_TITLE, "Marketing Brief items", 100, false);
    const list = this.sp.web.lists.getByTitle(LIST_TITLE);

    // Text fields
    await this.ensureField(() => list.fields.addText("Brand", { MaxLength: 255, Required: true }));
    await this.ensureField(() => list.fields.addText("Year", { MaxLength: 10, Required: true }));
    await this.ensureField(() => list.fields.addText("FigmaUrl", { MaxLength: 500, Required: false }));

    // Choice fields
    await this.ensureField(() => list.fields.addChoice("Season", {
      Choices: ["Summer", "Spring", "BTS", "Holiday"],
      Required: true,
    }));
    await this.ensureField(() => list.fields.addChoice("Priority", {
      Choices: ["Urgent", "Important", "Medium", "Low"],
      Required: true,
    }));
    await this.ensureField(() => list.fields.addChoice("Status", {
      Choices: ["Not Started", "In-progress", "Complete"],
      DefaultValue: "Not Started",
      Required: true,
    }));

    // DateTime fields
    await this.ensureField(() => list.fields.addDateTime("DueDate", { Required: true }));
    await this.ensureField(() => list.fields.addDateTime("GoLiveDate", { Required: true }));

    // Boolean fields
    await this.ensureField(() => list.fields.addBoolean("RouteTCP"));
    await this.ensureField(() => list.fields.addBoolean("RouteGYM"));
    await this.ensureField(() => list.fields.addBoolean("RouteCopy"));

    // User fields
    await this.ensureField(() => list.fields.addUser("CopyAssignedTo", { Required: false, SelectionMode: 0 }));
    await this.ensureField(() => list.fields.addUser("GymAssignedTo", { Required: false, SelectionMode: 0 }));
    await this.ensureField(() => list.fields.addUser("TCPAssignedTo", { Required: false, SelectionMode: 0 }));

    // Multiline text
    await this.ensureField(() => list.fields.addMultilineText("AssetDetails", {
      NumberOfLines: 6,
      RichText: false,
      Required: true,
    }));

    // Add fields to default view
    const viewFields = [
      "Brand", "Season", "Year", "Priority", "DueDate", "GoLiveDate",
      "Status", "FigmaUrl", "RouteTCP", "RouteGYM", "RouteCopy",
      "CopyAssignedTo", "GymAssignedTo", "TCPAssignedTo", "AssetDetails",
    ];
    const dv = list.defaultView;
    for (const field of viewFields) {
      try {
        await dv.fields.add(field);
      } catch {
        // field may already be in view
      }
    }
  }
}
