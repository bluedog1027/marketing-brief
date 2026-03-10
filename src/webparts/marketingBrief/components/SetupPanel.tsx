import * as React from "react";
import { Button, Spinner, Title1, Body1 } from "@fluentui/react-components";
import { Settings24Regular } from "@fluentui/react-icons";
import styles from "./MarketingBrief.module.scss";

export interface ISetupPanelProps {
  onSetup: () => Promise<void>;
  loading: boolean;
}

export const SetupPanel: React.FC<ISetupPanelProps> = ({ onSetup, loading }) => {
  return (
    <div className={styles.setupContainer}>
      <Settings24Regular style={{ fontSize: 48, color: "#2cafe2" }} />
      <Title1>Marketing Brief Setup</Title1>
      <Body1>
        The &quot;MarketingBriefs&quot; list was not found on this site. Click below to
        provision the list with all required columns.
      </Body1>
      <Button
        appearance="primary"
        size="large"
        onClick={onSetup}
        disabled={loading}
        style={{ backgroundColor: "#2cafe2", minWidth: 200 }}
      >
        {loading ? <Spinner size="tiny" label="Provisioning..." /> : "Setup / Configure"}
      </Button>
    </div>
  );
};
