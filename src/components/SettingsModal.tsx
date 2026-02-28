import { useState } from "react";
import { getToken, setToken, clearToken } from "../lib/githubSync";
import "./SettingsModal.css";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  syncStatus: "idle" | "syncing" | "success" | "error";
}

export default function SettingsModal({
  open,
  onClose,
  syncStatus,
}: SettingsModalProps) {
  const [pat, setPat] = useState(getToken() ?? "");

  if (!open) return null;

  const hasSaved = !!getToken();

  const handleSave = () => {
    const trimmed = pat.trim();
    if (trimmed) {
      setToken(trimmed);
      onClose();
    }
  };

  const handleClear = () => {
    clearToken();
    setPat("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Sync Settings</h3>
        <p className="modal-desc">
          Enter a GitHub personal access token to sync your travel data across
          devices. Create a fine-grained token at{" "}
          <a
            href="https://github.com/settings/tokens?type=beta"
            target="_blank"
            rel="noreferrer"
          >
            github.com/settings/tokens
          </a>{" "}
          with <strong>Contents: Read and write</strong> permission on the{" "}
          <code>travel-map</code> repo.
        </p>
        <input
          type="password"
          className="pat-input"
          placeholder="github_pat_..."
          value={pat}
          onChange={(e) => setPat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <div className="modal-actions">
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
          {hasSaved && (
            <button className="btn-clear" onClick={handleClear}>
              Clear Token
            </button>
          )}
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
        <div className={`sync-indicator ${syncStatus}`}>
          {syncStatus === "syncing" && "Syncing..."}
          {syncStatus === "success" && "Synced"}
          {syncStatus === "error" && "Sync failed"}
          {syncStatus === "idle" && (hasSaved ? "Token saved" : "No token set")}
        </div>
      </div>
    </div>
  );
}
