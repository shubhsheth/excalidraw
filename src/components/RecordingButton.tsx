import React from "react";
import clsx from "clsx";
import { t } from "../i18n";
import { AppState } from "../types";
import { capitalizeString } from "../utils";

const RECORDING_ICON = (
  <svg viewBox="0 0 576 512">
    <circle cx="288" cy="256" r="250" stroke-width="35" fill="none" />
    <circle cx="288" cy="256" r="125" />
  </svg>
);

export const RecordingButton: React.FC<{
  appState: AppState;
  setAppState: React.Component<any, AppState>["setState"];
  isMobile?: boolean;
}> = ({ appState, setAppState, isMobile }) => {
  return (
    <label
      className={clsx(
        "ToolIcon ToolIcon_type_floating ToolIcon__recording",
        `ToolIcon_size_medium`,
        {
          "is-mobile": isMobile,
        },
      )}
      title={`${capitalizeString(t("toolBar.record"))} — O`}
    >
      <input
        className="ToolIcon_type_checkbox"
        type="checkbox"
        // name="editor-library"
        onChange={(event) => {
          setAppState({ isRecording: event.target.checked });
        }}
        checked={appState.isRecording}
        aria-label={capitalizeString(t("toolBar.record"))}
        aria-keyshortcuts="0"
      />
      <div className="ToolIcon__icon">{RECORDING_ICON}</div>
    </label>
  );
};
