import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export function AiIdpLoading() {
  return (
    <div className="surface-card rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-background to-background p-8 text-center shadow-md animate-pulse">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-7 animate-spin text-primary" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground flex items-center justify-center gap-2">
        <Loader2 className="size-4 animate-spin text-primary" />
        Generating AI Development Plan...
      </h3>
      <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
        Evaluating employee competencies against target succession role and benchmarking skill gaps using Gemini AI...
      </p>
      
      <div className="mt-6 space-y-3 max-w-lg mx-auto">
        <div className="h-3 w-full rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-3/4 rounded-full bg-muted animate-pulse mx-auto" />
        <div className="h-3 w-1/2 rounded-full bg-muted animate-pulse mx-auto" />
      </div>
    </div>
  );
}
