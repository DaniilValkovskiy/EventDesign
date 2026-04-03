import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportModal({ open, onOpenChange }: ReportModalProps) {
  const [parameters, setParameters] = useState({
    budget: true,
    taskCompletion: true,
    teamPerformance: false,
    timeline: true,
    costBreakdown: false,
    upcomingDeadlines: true,
  });

  const toggleParameter = (key: keyof typeof parameters) => {
    setParameters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    const selectedParams = Object.entries(parameters)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    
    if (selectedParams.length === 0) {
      toast.error("Please select at least one parameter");
      return;
    }

    toast.success("Report generated successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Generate Report
          </DialogTitle>
          <DialogDescription>
            Select the parameters you want to include in your event report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="budget"
                checked={parameters.budget}
                onCheckedChange={() => toggleParameter("budget")}
              />
              <Label htmlFor="budget" className="cursor-pointer">
                <div className="flex flex-col">
                  <span>Budget Overview</span>
                  <span className="text-xs text-muted-foreground">Total budget, spent, and remaining</span>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="taskCompletion"
                checked={parameters.taskCompletion}
                onCheckedChange={() => toggleParameter("taskCompletion")}
              />
              <Label htmlFor="taskCompletion" className="cursor-pointer">
                <div className="flex flex-col">
                  <span>Task Completion</span>
                  <span className="text-xs text-muted-foreground">Progress by category and overall status</span>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="teamPerformance"
                checked={parameters.teamPerformance}
                onCheckedChange={() => toggleParameter("teamPerformance")}
              />
              <Label htmlFor="teamPerformance" className="cursor-pointer">
                <div className="flex flex-col">
                  <span>Team Performance</span>
                  <span className="text-xs text-muted-foreground">Tasks completed per team member</span>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="timeline"
                checked={parameters.timeline}
                onCheckedChange={() => toggleParameter("timeline")}
              />
              <Label htmlFor="timeline" className="cursor-pointer">
                <div className="flex flex-col">
                  <span>Timeline Analysis</span>
                  <span className="text-xs text-muted-foreground">Key milestones and schedule overview</span>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="costBreakdown"
                checked={parameters.costBreakdown}
                onCheckedChange={() => toggleParameter("costBreakdown")}
              />
              <Label htmlFor="costBreakdown" className="cursor-pointer">
                <div className="flex flex-col">
                  <span>Cost Breakdown</span>
                  <span className="text-xs text-muted-foreground">Detailed expenses by category</span>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="upcomingDeadlines"
                checked={parameters.upcomingDeadlines}
                onCheckedChange={() => toggleParameter("upcomingDeadlines")}
              />
              <Label htmlFor="upcomingDeadlines" className="cursor-pointer">
                <div className="flex flex-col">
                  <span>Upcoming Deadlines</span>
                  <span className="text-xs text-muted-foreground">Tasks due in the next 7 days</span>
                </div>
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} className="bg-[#6366F1] hover:bg-[#6366F1]/90">
            <Download className="size-4 mr-2" />
            Generate & Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
