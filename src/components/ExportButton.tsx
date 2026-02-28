interface ExportButtonProps {
  exportJSON: () => string;
}

export default function ExportButton({ exportJSON }: ExportButtonProps) {
  const handleExport = async () => {
    const payload = exportJSON();
    try {
      await navigator.clipboard.writeText(payload);
      window.alert("Copied updated profiles JSON to clipboard.");
    } catch {
      window.alert("Could not copy automatically. Please copy from console.");
      console.log(payload);
    }
  };

  return (
    <button className="export-button" onClick={handleExport}>
      Export JSON
    </button>
  );
}
