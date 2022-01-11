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
  canvas: HTMLCanvasElement | null;
  isMobile?: boolean;
}> = ({ appState, setAppState, canvas, isMobile }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const mediaStream = React.useRef<MediaStream | null>(null);
  const mediaChunks = React.useRef<Blob[]>([]);

  const startRecording = () => {
    if (isRecording) {
      return;
    }
    if (!canvas) {
      return;
    }

    mediaStream.current = canvas.captureStream(30);
    mediaRecorder.current = new MediaRecorder(mediaStream.current);

    if (!mediaRecorder.current) {
      return;
    }
    setIsRecording(true);
    mediaChunks.current = [];
    mediaRecorder.current.ondataavailable = mediaSaveDate;
    mediaRecorder.current.onstop = mediaStop;
    mediaRecorder.current.start(1000);
  };

  const stopRecording = () => {
    if (!isRecording) {
      return;
    }
    if (!mediaRecorder.current) {
      return;
    }
    setIsRecording(false);
    mediaRecorder.current.stop();
  };

  const mediaSaveDate = (event: BlobEvent) => {
    mediaChunks.current.push(event.data);
  };

  const mediaStop = () => {
    if (!mediaRecorder.current) {
      return;
    }

    const blob = new Blob(mediaChunks.current, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

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
        onChange={(event) => {
          setAppState({ isRecording: event.target.checked });
          toggleRecording();
        }}
        checked={appState.isRecording}
        aria-label={capitalizeString(t("toolBar.record"))}
        aria-keyshortcuts="0"
      />
      <div className="ToolIcon__icon">{RECORDING_ICON}</div>
    </label>
  );
};
