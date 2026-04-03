import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Filter, FileText } from "lucide-react";
import { useState } from "react";

export function FiltersBar({ onGenerateReport }: { onGenerateReport: () => void }) {
  const [dateFilter, setDateFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [costFilter, setCostFilter] = useState<string[]>([]);

  const toggleFilter = (filter: string[], value: string, setter: (values: string[]) => void) => {
    if (filter.includes(value)) {
      setter(filter.filter((f) => f !== value));
    } else {
      setter([...filter, value]);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filters:</span>
        
        {/* Date Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Date {dateFilter.length > 0 && `(${dateFilter.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={dateFilter.includes("today")}
              onCheckedChange={() => toggleFilter(dateFilter, "today", setDateFilter)}
            >
              Today
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={dateFilter.includes("week")}
              onCheckedChange={() => toggleFilter(dateFilter, "week", setDateFilter)}
            >
              This Week
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={dateFilter.includes("month")}
              onCheckedChange={() => toggleFilter(dateFilter, "month", setDateFilter)}
            >
              This Month
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={dateFilter.includes("overdue")}
              onCheckedChange={() => toggleFilter(dateFilter, "overdue", setDateFilter)}
            >
              Overdue
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Category {categoryFilter.length > 0 && `(${categoryFilter.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={categoryFilter.includes("equipment")}
              onCheckedChange={() => toggleFilter(categoryFilter, "equipment", setCategoryFilter)}
            >
              Equipment
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter.includes("catering")}
              onCheckedChange={() => toggleFilter(categoryFilter, "catering", setCategoryFilter)}
            >
              Catering
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter.includes("staff")}
              onCheckedChange={() => toggleFilter(categoryFilter, "staff", setCategoryFilter)}
            >
              Staff
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter.includes("venue")}
              onCheckedChange={() => toggleFilter(categoryFilter, "venue", setCategoryFilter)}
            >
              Venue
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cost Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Cost {costFilter.length > 0 && `(${costFilter.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Cost</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={costFilter.includes("low")}
              onCheckedChange={() => toggleFilter(costFilter, "low", setCostFilter)}
            >
              Low (&lt; $500)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={costFilter.includes("medium")}
              onCheckedChange={() => toggleFilter(costFilter, "medium", setCostFilter)}
            >
              Medium ($500 - $2000)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={costFilter.includes("high")}
              onCheckedChange={() => toggleFilter(costFilter, "high", setCostFilter)}
            >
              High (&gt; $2000)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {(dateFilter.length > 0 || categoryFilter.length > 0 || costFilter.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDateFilter([]);
              setCategoryFilter([]);
              setCostFilter([]);
            }}
          >
            Clear All
          </Button>
        )}
      </div>

      <Button onClick={onGenerateReport} variant="outline" size="sm">
        <FileText className="size-4 mr-2" />
        Generate Report
      </Button>
    </div>
  );
}
