import { useState, useCallback } from "react";

interface TooltipState {
  content: string;
  x: number;
  y: number;
  visible: boolean;
}

const initialState: TooltipState = {
  content: "",
  x: 0,
  y: 0,
  visible: false,
};

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>(initialState);

  const show = useCallback((content: string, x: number, y: number) => {
    setTooltip({ content, x, y, visible: true });
  }, []);

  const hide = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const move = useCallback((x: number, y: number) => {
    setTooltip((prev) => ({ ...prev, x, y }));
  }, []);

  return { tooltip, show, hide, move };
}

export function Tooltip({
  content,
  x,
  y,
  visible,
}: TooltipState) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: x + 12,
        top: y - 28,
        background: "rgba(15, 23, 42, 0.95)",
        color: "#e2e8f0",
        padding: "6px 12px",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: 500,
        pointerEvents: "none",
        zIndex: 1000,
        border: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        whiteSpace: "nowrap",
      }}
    >
      {content}
    </div>
  );
}
