import * as React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { IMarketingBriefProps } from "./IMarketingBriefProps";
import { SPListSetup } from "../services/SPListSetup";
import { App } from "./App";
import { SetupPanel } from "./SetupPanel";
import styles from "./MarketingBrief.module.scss";

const MarketingBrief: React.FC<IMarketingBriefProps> = (props) => {
  const [listReady, setListReady] = React.useState<boolean | null>(null);
  const [setting, setSetting] = React.useState(false);

  const setup = React.useMemo(() => new SPListSetup(props.sp), [props.sp]);

  React.useEffect(() => {
    setup.listsExist().then((exists) => setListReady(exists));
  }, []);

  const handleSetup = async (): Promise<void> => {
    setSetting(true);
    try {
      await setup.runSetup();
      setListReady(true);
    } catch (err) {
      console.error("Setup failed", err);
      alert("Failed to provision list. Check console for details.");
    } finally {
      setSetting(false);
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.marketingBrief}>
        {listReady === null ? (
          <div className={styles.setupContainer}>Loading...</div>
        ) : listReady ? (
          <App sp={props.sp} context={props.context} />
        ) : (
          <SetupPanel onSetup={handleSetup} loading={setting} />
        )}
      </div>
    </FluentProvider>
  );
};

export default MarketingBrief;
