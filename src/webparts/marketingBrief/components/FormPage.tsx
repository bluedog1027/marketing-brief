import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Dropdown,
  Option,
  Checkbox,
  Textarea,
  Spinner,
  Label,
} from "@fluentui/react-components";
import { ArrowLeft24Regular, Save24Regular } from "@fluentui/react-icons";
import { SPFI } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { ListItemComments } from "@pnp/spfx-controls-react/lib/ListItemComments";
import { MarketingBriefService } from "../services/MarketingBriefService";
import { IMarketingBrief } from "../models/IMarketingBrief";
import styles from "./MarketingBrief.module.scss";

interface IFormPageProps {
  sp: SPFI;
  context: WebPartContext;
}

const SEASONS = ["Summer", "Spring", "BTS", "Holiday"];
const PRIORITIES = ["Urgent", "Important", "Medium", "Low"];
const STATUSES = ["Not Started", "In-progress", "Complete"];

export const FormPage: React.FC<IFormPageProps> = ({ sp, context }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const itemId = id ? parseInt(id, 10) : undefined;

  const svc = React.useMemo(() => new MarketingBriefService(sp), [sp]);

  const [loading, setLoading] = React.useState(isEdit);
  const [saving, setSaving] = React.useState(false);
  const [listId, setListId] = React.useState<string>("");

  const [title, setTitle] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [season, setSeason] = React.useState("Summer");
  const [year, setYear] = React.useState("");
  const [priority, setPriority] = React.useState("Medium");
  const [dueDate, setDueDate] = React.useState("");
  const [goLiveDate, setGoLiveDate] = React.useState("");
  const [figmaUrl, setFigmaUrl] = React.useState("");
  const [routeTCP, setRouteTCP] = React.useState(false);
  const [routeGYM, setRouteGYM] = React.useState(false);
  const [routeCopy, setRouteCopy] = React.useState(false);
  const [copyAssignedToId, setCopyAssignedToId] = React.useState<number | null>(null);
  const [gymAssignedToId, setGymAssignedToId] = React.useState<number | null>(null);
  const [tcpAssignedToId, setTcpAssignedToId] = React.useState<number | null>(null);
  const [assetDetails, setAssetDetails] = React.useState("");
  const [status, setStatus] = React.useState("Not Started");

  const [editItem, setEditItem] = React.useState<IMarketingBrief | null>(null);

  React.useEffect(() => {
    svc.getListId().then(setListId).catch(console.error);

    if (isEdit && itemId) {
      svc.getItem(itemId).then((item) => {
        setEditItem(item);
        setTitle(item.Title || "");
        setBrand(item.Brand || "");
        setSeason(item.Season || "Summer");
        setYear(item.Year || "");
        setPriority(item.Priority || "Medium");
        setDueDate(item.DueDate ? item.DueDate.substring(0, 10) : "");
        setGoLiveDate(item.GoLiveDate ? item.GoLiveDate.substring(0, 10) : "");
        setFigmaUrl(item.FigmaUrl || "");
        setRouteTCP(!!item.RouteTCP);
        setRouteGYM(!!item.RouteGYM);
        setRouteCopy(!!item.RouteCopy);
        setCopyAssignedToId(item.CopyAssignedToId || null);
        setGymAssignedToId(item.GymAssignedToId || null);
        setTcpAssignedToId(item.TCPAssignedToId || null);
        setAssetDetails(item.AssetDetails || "");
        setStatus(item.Status || "Not Started");
        setLoading(false);
      }).catch((err) => {
        console.error("Failed to load item", err);
        setLoading(false);
      });
    }
  }, [id]);

  const validate = (): boolean => {
    if (!title || !brand || !season || !year || !priority || !dueDate || !goLiveDate || !assetDetails) {
      alert("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSave = async (): Promise<void> => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Partial<IMarketingBrief> = {
        Title: title,
        Brand: brand,
        Season: season,
        Year: year,
        Priority: priority,
        DueDate: new Date(dueDate).toISOString(),
        GoLiveDate: new Date(goLiveDate).toISOString(),
        FigmaUrl: figmaUrl,
        RouteTCP: routeTCP,
        RouteGYM: routeGYM,
        RouteCopy: routeCopy,
        CopyAssignedToId: copyAssignedToId,
        GymAssignedToId: gymAssignedToId,
        TCPAssignedToId: tcpAssignedToId,
        AssetDetails: assetDetails,
        Status: status,
      };
      if (isEdit && itemId) {
        await svc.updateItem(itemId, payload);
      } else {
        await svc.createItem(payload);
      }
      navigate("/");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading..." />;
  }

  return (
    <>
      <div className={styles.buttonRow}>
        <Button
          icon={<ArrowLeft24Regular />}
          onClick={() => navigate("/")}
          appearance="subtle"
        >
          Back
        </Button>
        <Button
          icon={<Save24Regular />}
          onClick={handleSave}
          appearance="primary"
          disabled={saving}
          style={{ backgroundColor: "#2cafe2" }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <h2 style={{ color: "#2cafe2", marginTop: 0 }}>
        {isEdit ? "Edit Marketing Brief" : "New Marketing Brief"}
      </h2>

      <div className={styles.card}>
        <div className={styles.formGrid}>
          <div>
            <Label required>Brand</Label>
            <Input value={brand} onChange={(_, d) => setBrand(d.value)} style={{ width: "100%" }} />
          </div>
          <div>
            <Label required>Season</Label>
            <Dropdown
              value={season}
              selectedOptions={[season]}
              onOptionSelect={(_, d) => setSeason(d.optionValue || "Summer")}
              style={{ width: "100%" }}
            >
              {SEASONS.map((s) => <Option key={s} value={s}>{s}</Option>)}
            </Dropdown>
          </div>
          <div>
            <Label required>Year</Label>
            <Input value={year} onChange={(_, d) => setYear(d.value)} style={{ width: "100%" }} />
          </div>
          <div>
            <Label required>Title</Label>
            <Input value={title} onChange={(_, d) => setTitle(d.value)} style={{ width: "100%" }} />
          </div>
          <div>
            <Label required>Priority</Label>
            <Dropdown
              value={priority}
              selectedOptions={[priority]}
              onOptionSelect={(_, d) => setPriority(d.optionValue || "Medium")}
              style={{ width: "100%" }}
            >
              {PRIORITIES.map((p) => <Option key={p} value={p}>{p}</Option>)}
            </Dropdown>
          </div>
          <div>
            <Label required>Due Date</Label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <Label required>Go Live Date</Label>
            <input
              type="date"
              value={goLiveDate}
              onChange={(e) => setGoLiveDate(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <Label>Figma URL</Label>
            <Input value={figmaUrl} onChange={(_, d) => setFigmaUrl(d.value)} style={{ width: "100%" }} />
          </div>

          <div>
            <Checkbox
              label="Route to TCP"
              checked={routeTCP}
              onChange={(_, d) => setRouteTCP(!!d.checked)}
            />
          </div>
          <div>
            <Checkbox
              label="Route to GYM"
              checked={routeGYM}
              onChange={(_, d) => setRouteGYM(!!d.checked)}
            />
          </div>
          <div>
            <Checkbox
              label="Route to Copy"
              checked={routeCopy}
              onChange={(_, d) => setRouteCopy(!!d.checked)}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Dropdown
              value={status}
              selectedOptions={[status]}
              onOptionSelect={(_, d) => setStatus(d.optionValue || "Not Started")}
              style={{ width: "100%" }}
            >
              {STATUSES.map((s) => <Option key={s} value={s}>{s}</Option>)}
            </Dropdown>
          </div>

          <div className={styles.formFieldFull}>
            <PeoplePicker
              context={context as any}
              titleText="Copy Assigned To"
              personSelectionLimit={1}
              principalTypes={[PrincipalType.User]}
              resolveDelay={300}
              onChange={(items: any[]) => {
                setCopyAssignedToId(items.length > 0 ? items[0].id : null);
              }}
              defaultSelectedUsers={editItem?.CopyAssignedTo?.EMail ? [editItem.CopyAssignedTo.EMail] : []}
            />
          </div>

          <div className={styles.formFieldFull}>
            <PeoplePicker
              context={context as any}
              titleText="Gym Assigned To"
              personSelectionLimit={1}
              principalTypes={[PrincipalType.User]}
              resolveDelay={300}
              onChange={(items: any[]) => {
                setGymAssignedToId(items.length > 0 ? items[0].id : null);
              }}
              defaultSelectedUsers={editItem?.GymAssignedTo?.EMail ? [editItem.GymAssignedTo.EMail] : []}
            />
          </div>

          <div className={styles.formFieldFull}>
            <PeoplePicker
              context={context as any}
              titleText="TCP Assigned To"
              personSelectionLimit={1}
              principalTypes={[PrincipalType.User]}
              resolveDelay={300}
              onChange={(items: any[]) => {
                setTcpAssignedToId(items.length > 0 ? items[0].id : null);
              }}
              defaultSelectedUsers={editItem?.TCPAssignedTo?.EMail ? [editItem.TCPAssignedTo.EMail] : []}
            />
          </div>

          <div className={styles.formFieldFull}>
            <Label required>Asset Details</Label>
            <Textarea
              value={assetDetails}
              onChange={(_, d) => setAssetDetails(d.value)}
              rows={5}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {isEdit && itemId && listId && (
        <div className={`${styles.card} ${styles.commentsSection}`}>
          <h3 style={{ color: "#2cafe2", marginTop: 0 }}>Comments</h3>
          <ListItemComments
            listId={listId}
            itemId={itemId}
            serviceScope={context.serviceScope}
            label="Comments"
          />
        </div>
      )}
    </>
  );
};
