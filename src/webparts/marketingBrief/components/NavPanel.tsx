import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AddCircle24Regular,
  CirclePause24Regular,
  ArrowClockwise24Regular,
  CheckmarkCircle24Regular,
} from "@fluentui/react-icons";
import styles from "./MarketingBrief.module.scss";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const navItems: NavItem[] = [
  { label: "New Marketing Brief", path: "/new", icon: <AddCircle24Regular /> },
  { label: "Not Started", path: "/status/Not Started", icon: <CirclePause24Regular /> },
  { label: "In-progress", path: "/status/In-progress", icon: <ArrowClockwise24Regular /> },
  { label: "Complete", path: "/status/Complete", icon: <CheckmarkCircle24Regular /> },
];

export const NavPanel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.navPanel}>
      <div
        className={styles.navHeader}
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        📋 Marketing Brief
      </div>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path ||
          decodeURIComponent(location.pathname) === item.path;
        return (
          <div
            key={item.path}
            className={`${styles.navLink} ${isActive ? styles.active : ""}`}
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer" }}
          >
            {item.icon}
            {item.label}
          </div>
        );
      })}
    </div>
  );
};
