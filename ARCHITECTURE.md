# Architecture — Marketing Brief

## Stack
- **SPFx 1.18.2** — SharePoint Framework web part
- **React 17** — UI library
- **Fluent UI v9** (`@fluentui/react-components`) — Design system
- **PnP/SP v4** — SharePoint REST abstraction
- **PnP SPFx Controls** — PeoplePicker, ListItemComments
- **React Router v6** (HashRouter) — Client-side routing

## Structure

```
src/webparts/marketingBrief/
├── MarketingBriefWebPart.ts       # Entry point — initializes PnP SP, renders root
├── models/IMarketingBrief.ts      # Data interfaces
├── services/
│   ├── MarketingBriefService.ts   # CRUD operations on MarketingBriefs list
│   └── SPListSetup.ts            # Idempotent list provisioning
└── components/
    ├── MarketingBrief.tsx         # Root — checks list exists, shows setup or app
    ├── App.tsx                    # HashRouter with routes
    ├── NavPanel.tsx               # Left sidebar navigation
    ├── HomePage.tsx               # List view with search & table
    ├── FormPage.tsx               # Create/edit form with people pickers & comments
    └── SetupPanel.tsx             # First-run setup UI
```

## Data Flow
1. WebPart initializes `SPFI` via `SPFx(context)`
2. Root component checks if `MarketingBriefs` list exists
3. If not → shows Setup panel to provision list
4. If yes → renders App with HashRouter
5. All data ops go through `MarketingBriefService`

## SharePoint List
Single list `MarketingBriefs` with 17 columns including user fields, choices, dates, and booleans. See REQUIREMENTS.md for full schema.
