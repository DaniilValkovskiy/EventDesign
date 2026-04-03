import { useState } from "react";
import { Calendar as ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";


export function EventNotes() {
  
  // 1. функции-сеттеры (setTitle, setBudget, setNotes, setDate)
  const [date, setDate] = useState("2026-06-15");
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState("Wedding 2026");
  const [budget, setBudget] = useState("$45,000");
  const [notes, setNotes] = useState("Planning Sarah & Mike's wedding. Ceremony at 3 PM, Reception at 6 PM. Venue: Grand Plaza Hotel. Guest count: ~200.");
  

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <h3>Event Details</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Event Title</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Event Date</label>
                  <Input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                  />
                </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Budget</label>
                <Input 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)} 
                />
              </div>
              
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">General Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
            
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}