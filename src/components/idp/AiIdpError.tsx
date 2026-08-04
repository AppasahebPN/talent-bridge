import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AiIdpErrorProps {
  message: string;
  onRetry?: () => void;
}

export function AiIdpError({ message, onRetry }: AiIdpErrorProps) {
  return (
    <Alert variant="destructive" className="my-4 surface-card border-destructive/40 bg-destructive/5">
      <AlertTriangle className="size-5" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <AlertTitle className="font-semibold text-base">Generation Failed</AlertTitle>
          <AlertDescription className="mt-1 text-xs text-muted-foreground">
            {message}
          </AlertDescription>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="mr-2 size-3.5" /> Retry
          </Button>
        )}
      </div>
    </Alert>
  );
}
