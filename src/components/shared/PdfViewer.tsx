"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface PdfViewerProps {
  url: string;
  height?: string;
  width?: string;
}

export function PdfViewer({ url, height = "500px", width = "100%" }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when URL changes
    setLoading(true);
    
    // Simulate iframe load event
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="relative" style={{ height, width }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <iframe
        src={`${url}#toolbar=0&navpanes=0`}
        style={{ height: "100%", width: "100%" }}
        className="border-0"
        onLoad={() => setLoading(false)}
        title="PDF Viewer"
      />
    </div>
  );
}
