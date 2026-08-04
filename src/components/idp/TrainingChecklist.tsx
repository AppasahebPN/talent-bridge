import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingChecklistProps {
  trainings: string[];
  className?: string;
}

export function TrainingChecklist({ trainings, className }: TrainingChecklistProps) {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  if (!trainings || trainings.length === 0) {
    return <p className="text-xs text-muted-foreground">No specific training modules recommended.</p>;
  }

  const toggleTraining = (index: number) => {
    setCompleted((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {trainings.map((item, index) => {
        const isDone = !!completed[index];
        const id = `training-item-${index}`;

        return (
          <div
            key={index}
            onClick={() => toggleTraining(index)}
            className={cn(
              "flex items-start gap-3 rounded-lg border border-border p-3 transition-colors cursor-pointer select-none",
              isDone ? "bg-muted/40 opacity-70" : "bg-card hover:bg-muted/30"
            )}
          >
            <Checkbox
              id={id}
              checked={isDone}
              onCheckedChange={() => toggleTraining(index)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <label
                htmlFor={id}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer flex items-center gap-2",
                  isDone ? "line-through text-muted-foreground" : "text-foreground"
                )}
              >
                <GraduationCap className="size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
