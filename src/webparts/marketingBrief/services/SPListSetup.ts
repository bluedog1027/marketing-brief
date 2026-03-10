import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

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

  public async runSetup(): Promise<void> {
    // Create the list
    const listAddResult = await this.sp.web.lists.add(LIST_TITLE, "Marketing Brief items", 100, false);
    const list = this.sp.web.lists.getByTitle(LIST_TITLE);

    // Text fields
    await list.fields.addText("Brand", { MaxLength: 255, Required: true });
    await list.fields.addText("Year", { MaxLength: 10, Required: true });
    await list.fields.addText("FigmaUrl", { MaxLength: 500, Required: false });

    // Choice fields
    await list.fields.addChoice("Season", {
      Choices: ["Summer", "Spring", "BTS", "Holiday"],
      Required: true,
    });
    await list.fields.addChoice("Priority", {
      Choices: ["Urgent", "Important", "Medium", "Low"],
      Required: true,
    });
    await list.fields.addChoice("Status", {
      Choices: ["Not Started", "In-progress", "Complete"],
      DefaultValue: "Not Started",
      Required: true,
    });

    // DateTime fields
    await list.fields.addDateTime("DueDate", { Required: true });
    await list.fields.addDateTime("GoLiveDate", { Required: true });

    // Boolean fields
    await list.fields.addBoolean("RouteTCP");
    await list.fields.addBoolean("RouteGYM");
    await list.fields.addBoolean("RouteCopy");

    // User fields
    await list.fields.addUser("CopyAssignedTo", { Required: false, SelectionMode: 0 });
    await list.fields.addUser("GymAssignedTo", { Required: false, SelectionMode: 0 });
    await list.fields.addUser("TCPAssignedTo", { Required: false, SelectionMode: 0 });

    // Multiline text
    await list.fields.addMultilineText("AssetDetails", {
      NumberOfLines: 6,
      RichText: false,
      Required: true,
    });

    // Add fields to default view
    const viewFields = [
      "Brand", "Season", "Year", "Priority", "DueDate", "GoLiveDate",
      "Status", "FigmaUrl", "RouteTCP", "RouteGYM", "RouteCopy",
      "CopyAssignedTo", "GymAssignedTo", "TCPAssignedTo", "AssetDetails",
    ];
    const defaultView = await list.defaultView();
    for (const field of viewFields) {
      try {
        await list.views.getById(defaultView.Id).fields.add(field);
      } catch {
        // field may already be in view
      }
    }
  }
}
