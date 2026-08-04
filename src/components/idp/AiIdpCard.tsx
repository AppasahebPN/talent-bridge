import React from "react";
import type { IdpData } from "@/types";
import { CompetencyGapBadges } from "./CompetencyGapBadges";
import { TrainingChecklist } from "./TrainingChecklist";
import { MeterBar } from "@/components/common/competency-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exportIdpPdf } from "@/utils/exportPdf";
import {
  Award,
  Clock,
  Download,
  GraduationCap,
  RefreshCw,
  Repeat,
  Sparkles,
  Target,
  UserCheck,
} from "lucide-react";

interface AiIdpCardProps {
  data: IdpData;
  source?: string;
  employeeName?: string;
  employeeId?: string;
  currentRole?: string;
  department?: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function AiIdpCard({
  data,
  source = "Gemini AI",
  employeeName = "Employee",
  employeeId = "EMP001",
  currentRole,
  department,
  onRegenerate,
  isRegenerating = false,
}: AiIdpCardProps) {
  const readinessTone =
    data.readinessScore >= 80 ? "success" : data.readinessScore >= 60 ? "warning" : "danger";

  const handleExportPdf = () => {
    exportIdpPdf({
      employeeId,
      employeeName,
      currentRole,
      department,
      currentReadiness: data.readinessScore,
      expectedReadiness: Math.min(98, data.readinessScore + 10),
      readinessSummary: data.readinessSummary,
      competencyGaps: data.competencyGaps,
      training: data.training,
      certifications: data.certifications,
      mentor: data.mentor,
      jobRotation: data.jobRotation,
      timeline: data.timeline,
      source,
    });
  };

  return (
    <Card className="surface-card border-primary/20 overflow-hidden shadow-lg transition-all">
      <CardHeader className="bg-muted/30 pb-4 border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                AI-Powered Individual Development Plan
              </CardTitle>
              <CardDescription className="text-xs">
                Targeted leadership roadmap & readiness analysis
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 font-medium px-2.5 py-1 text-xs"
            >
              <Sparkles className="mr-1 size-3" /> {source}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              className="h-8 text-xs gap-1.5 border-primary/30 hover:bg-primary/5 text-primary"
            >
              <Download className="size-3.5" />
              Export PDF
            </Button>
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="h-8 text-xs gap-1.5"
              >
                <RefreshCw className={`size-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* 1. Readiness Score & Summary */}
        <div className="grid gap-4 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[200px_minmax(0,1fr)] items-center">
          <div className="text-center sm:text-left border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 sm:pr-4">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Target className="size-4 text-primary" />
              <span>Readiness Score</span>
            </div>
            <div className="mt-2 flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-3xl font-extrabold tabular-nums text-foreground">
                {data.readinessScore}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-2">
              <MeterBar value={data.readinessScore} tone={readinessTone} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Readiness Summary
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {data.readinessSummary}
            </p>
          </div>
        </div>

        {/* 2. Competency Gaps */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            Competency Gaps
          </h4>
          <CompetencyGapBadges gaps={data.competencyGaps} />
        </div>

        {/* 3. Recommended Training Checklist */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <GraduationCap className="size-4 text-primary" />
            Recommended Training
          </h4>
          <TrainingChecklist trainings={data.training} />
        </div>

        {/* 4. Certifications, Mentor, Job Rotation, Timeline */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Certifications */}
          <div className="rounded-lg border border-border bg-card p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              <Award className="size-4 text-primary" />
              <span>Certifications</span>
            </div>
            {data.certifications && data.certifications.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.certifications.map((cert, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    <Award className="size-3 text-primary" />
                    {cert}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">None specified</p>
            )}
          </div>

          {/* Mentor */}
          <div className="rounded-lg border border-border bg-card p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              <UserCheck className="size-4 text-primary" />
              <span>Recommended Mentor</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {data.mentor || "Executive Mentor"}
            </p>
          </div>

          {/* Job Rotation & Timeline */}
          <div className="rounded-lg border border-border bg-card p-3.5 sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                <Repeat className="size-4 text-primary" />
                <span>Job Rotation</span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {data.jobRotation || "N/A"}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5 text-primary" />
                <span>Target Timeline:</span>
              </div>
              <Badge variant="secondary" className="font-semibold text-xs">
                {data.timeline || "6 Months"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
