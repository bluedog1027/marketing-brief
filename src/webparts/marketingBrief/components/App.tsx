import * as React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { IMarketingBriefProps } from "./IMarketingBriefProps";
import { NavPanel } from "./NavPanel";
import { HomePage } from "./HomePage";
import { FormPage } from "./FormPage";
import styles from "./MarketingBrief.module.scss";

export const App: React.FC<IMarketingBriefProps> = (props) => {
  return (
    <HashRouter>
      <NavPanel />
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<HomePage sp={props.sp} context={props.context} />} />
          <Route path="/status/:status" element={<HomePage sp={props.sp} context={props.context} />} />
          <Route path="/new" element={<FormPage sp={props.sp} context={props.context} />} />
          <Route path="/edit/:id" element={<FormPage sp={props.sp} context={props.context} />} />
        </Routes>
      </div>
    </HashRouter>
  );
};
