# Requirements — Marketing Brief

## Overview
SPA built with SPFx + Fluent UI v9 + PnP/SP + React Router (HashRouter). Manages marketing briefs stored in a SharePoint list.

## SharePoint List: MarketingBriefs

| Column | Internal Name | Type | Required |
|---|---|---|---|
| Title | Title | Text (built-in) | Yes |
| Brand | Brand | Text | Yes |
| Season | Season | Choice (Summer, Spring, BTS, Holiday) | Yes |
| Year | Year | Text | Yes |
| Priority | Priority | Choice (Urgent, Important, Medium, Low) | Yes |
| DueDate | DueDate | DateTime | Yes |
| GoLiveDate | GoLiveDate | DateTime | Yes |
| FigmaUrl | FigmaUrl | Text (500) | No |
| RouteTCP | RouteTCP | Boolean | No |
| RouteGYM | RouteGYM | Boolean | No |
| RouteCopy | RouteCopy | Boolean | No |
| CopyAssignedTo | CopyAssignedTo | User | No |
| GymAssignedTo | GymAssignedTo | User | No |
| TCPAssignedTo | TCPAssignedTo | User | No |
| AssetDetails | AssetDetails | Multiline (plain) | Yes |
| Status | Status | Choice (Not Started, In-progress, Complete) | Yes, default "Not Started" |

## Routes
- `/` — Home (active briefs: Not Started + In-progress)
- `/new` — Create new brief
- `/edit/:id` — Edit existing brief
- `/status/:status` — Filter by status

## Features
- Auto-provisioning of SharePoint list via Setup button
- People pickers for user assignment fields
- Comments on edit form via ListItemComments
- Search/filter toolbar
- Status badges with color coding
- Responsive layout with left nav panel
