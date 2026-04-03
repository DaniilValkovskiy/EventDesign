import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Calendar, DollarSign, Clock } from "lucide-react";
import { motion } from "motion/react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  deadline: string; // ISO date string
  cost: number;
  assignee: string;
}

interface Category {
  id: string;
  name: string;
  tasks: Task[];
}

// Helper to check if deadline is within 24 hours
const isUrgent = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilDeadline > 0 && hoursUntilDeadline < 24;
};

// Helper to format deadline display
const formatDeadline = (deadline: string): string => {
  const date = new Date(deadline);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date < now) {
    return "Overdue";
  } else if (date >= today && date < tomorrow) {
    return `Today ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (date >= tomorrow && date < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
    return `Tomorrow ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "equipment",
    name: "Equipment",
    tasks: [
      { id: "e1", title: "Book sound system", completed: false, deadline: "2026-03-26T10:00:00", cost: 850, assignee: "SC" },
      { id: "e2", title: "Rent projector & screen", completed: true, deadline: "2026-03-28T14:00:00", cost: 450, assignee: "MJ" },
      { id: "e3", title: "Stage lighting setup", completed: false, deadline: "2026-04-02T09:00:00", cost: 1200, assignee: "ED" },
      { id: "e4", title: "Microphones & stands", completed: false, deadline: "2026-03-26T16:00:00", cost: 320, assignee: "TW" },
    ],
  },
  {
    id: "catering",
    name: "Catering",
    tasks: [
      { id: "c1", title: "Finalize menu with chef", completed: false, deadline: "2026-04-05T11:00:00", cost: 8500, assignee: "SC" },
      { id: "c2", title: "Order wedding cake", completed: true, deadline: "2026-03-30T10:00:00", cost: 950, assignee: "ED" },
      { id: "c3", title: "Confirm dietary restrictions", completed: false, deadline: "2026-04-10T15:00:00", cost: 0, assignee: "MJ" },
      { id: "c4", title: "Book bartender service", completed: false, deadline: "2026-03-26T09:00:00", cost: 1200, assignee: "SC" },
    ],
  },
  {
    id: "staff",
    name: "Staff",
    tasks: [
      { id: "s1", title: "Hire event coordinator", completed: true, deadline: "2026-03-25T12:00:00", cost: 2500, assignee: "MJ" },
      { id: "s2", title: "Book photographer", completed: false, deadline: "2026-04-08T10:00:00", cost: 3200, assignee: "ED" },
      { id: "s3", title: "Arrange valet parking", completed: false, deadline: "2026-04-15T14:00:00", cost: 800, assignee: "TW" },
      { id: "s4", title: "Security personnel", completed: false, deadline: "2026-03-27T11:00:00", cost: 1500, assignee: "SC" },
    ],
  },
  {
    id: "venue",
    name: "Venue",
    tasks: [
      { id: "v1", title: "Sign venue contract", completed: true, deadline: "2026-03-20T10:00:00", cost: 12000, assignee: "SC" },
      { id: "v2", title: "Plan seating arrangement", completed: false, deadline: "2026-04-20T15:00:00", cost: 0, assignee: "ED" },
      { id: "v3", title: "Decorate ceremony space", completed: false, deadline: "2026-06-14T09:00:00", cost: 2800, assignee: "MJ" },
    ],
  },
];

export function KanbanBoard() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const toggleTaskComplete = (categoryId: string, taskId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : category
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card key={category.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{category.name}</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {category.tasks.filter((t) => !t.completed).length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {category.tasks.map((task) => {
              const urgent = isUrgent(task.deadline) && !task.completed;
              const overdue = new Date(task.deadline) < new Date() && !task.completed;
              
              return (
                <motion.div
                  key={task.id}
                  layout
                  className={`p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all ${
                    urgent ? "ring-2 ring-[#F97316] ring-opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id={task.id}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskComplete(category.id, task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-2">
                      <label
                        htmlFor={task.id}
                        className={`text-sm cursor-pointer block ${
                          task.completed ? "line-through opacity-50" : ""
                        }`}
                      >
                        {task.title}
                      </label>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Deadline Badge with Smart Color */}
                        <Badge
                          variant={urgent ? "default" : overdue ? "destructive" : "outline"}
                          className={`text-xs ${
                            urgent
                              ? "bg-[#F97316] hover:bg-[#F97316]/90 animate-pulse"
                              : ""
                          }`}
                        >
                          {urgent && <Clock className="size-3 mr-1" />}
                          <Calendar className="size-3 mr-1" />
                          {formatDeadline(task.deadline)}
                        </Badge>
                        
                        {/* Cost Badge */}
                        {task.cost > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <DollarSign className="size-3 mr-0.5" />
                            {task.cost.toLocaleString()}
                          </Badge>
                        )}
                        
                        {/* Assignee Badge */}
                        <Badge variant="secondary" className="text-xs">
                          {task.assignee}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
