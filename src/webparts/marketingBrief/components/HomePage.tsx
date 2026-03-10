import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Spinner } from "@fluentui/react-components";
import { Search24Regular } from "@fluentui/react-icons";
import { SPFI } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MarketingBriefService } from "../services/MarketingBriefService";
import { IMarketingBrief } from "../models/IMarketingBrief";
import styles from "./MarketingBrief.module.scss";

interface IHomePageProps {
  sp: SPFI;
  context: WebPartContext;
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case "Not Started": return styles.statusNotStarted;
    case "In-progress": return styles.statusInProgress;
    case "Complete": return styles.statusComplete;
    default: return "";
  }
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
};

export const HomePage: React.FC<IHomePageProps> = ({ sp }) => {
  const { status } = useParams<{ status?: string }>();
  const navigate = useNavigate();
  const [items, setItems] = React.useState<IMarketingBrief[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const svc = React.useMemo(() => new MarketingBriefService(sp), [sp]);

  const loadItems = async (): Promise<void> => {
    setLoading(true);
    try {
      let filter: string | undefined;
      if (status) {
        filter = `Status eq '${status}'`;
      } else {
        filter = "(Status eq 'Not Started' or Status eq 'In-progress')";
      }
      const data = await svc.getItems(filter);
      setItems(data);
    } catch (err) {
      console.error("Failed to load items", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadItems();
  }, [status]);

  const filtered = search
    ? items.filter((i) => i.Title.toLowerCase().includes(search.toLowerCase()))
    : items;

  const heading = status ? status : "Active Briefs";

  return (
    <>
      <h2 style={{ color: "#2cafe2", marginTop: 0 }}>{heading}</h2>
      <div className={styles.toolbar}>
        <Input
          contentBefore={<Search24Regular />}
          placeholder="Search by title..."
          value={search}
          onChange={(_, d) => setSearch(d.value)}
          style={{ minWidth: 280 }}
        />
      </div>
      <div className={styles.card}>
        {loading ? (
          <Spinner label="Loading briefs..." />
        ) : filtered.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
            No items found.
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Brand</th>
                  <th>Season</th>
                  <th>Year</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Go Live Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.Id}>
                    <td>
                      <a
                        className={styles.titleLink}
                        onClick={() => navigate(`/edit/${item.Id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.Title}
                      </a>
                    </td>
                    <td>{item.Brand}</td>
                    <td>{item.Season}</td>
                    <td>{item.Year}</td>
                    <td>{item.Priority}</td>
                    <td>{formatDate(item.DueDate)}</td>
                    <td>{formatDate(item.GoLiveDate)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(item.Status)}`}>
                        {item.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
