import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, Calendar, Users, CheckCircle2, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "../../../assets/Logo.svg";

const MOCK_EVENTS = [
  {
    id: "1",
    name: "Wedding 2026",
    date: "June 15, 2026",
    dateObj: new Date(2026, 5, 15),
    budget: 45000,
    budgetDisplay: "$45,000",
    tasksCompleted: 23,
    tasksTotal: 67,
    teamSize: 5,
  },
  {
    id: "2",
    name: "Product Launch Party",
    date: "April 3, 2026",
    dateObj: new Date(2026, 3, 3),
    budget: 12500,
    budgetDisplay: "$12,500",
    tasksCompleted: 45,
    tasksTotal: 52,
    teamSize: 3,
  },
  {
    id: "3",
    name: "Annual Conference 2026",
    date: "September 20, 2026",
    dateObj: new Date(2026, 8, 20),
    budget: 85000,
    budgetDisplay: "$85,000",
    tasksCompleted: 12,
    tasksTotal: 98,
    teamSize: 8,
  },
];

export function EventsDashboard() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showBudgetFilter, setShowBudgetFilter] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [filterSettings, setFilterSettings] = useState({
    dateStart: "",
    dateEnd: "",
    budgetMin: "",
    budgetMax: "",
  });

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const filterEvents = () => {
    return MOCK_EVENTS.filter(event => {
      // Search filter
      if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filterSettings.dateStart || filterSettings.dateEnd) {
        if (filterSettings.dateStart) {
          const startDate = parseDate(filterSettings.dateStart);
          if (startDate && event.dateObj < startDate) return false;
        }

        if (filterSettings.dateEnd) {
          const endDate = parseDate(filterSettings.dateEnd);
          if (endDate && event.dateObj > endDate) return false;
        }
      }

      // Budget range filter
      if (filterSettings.budgetMin !== "" || filterSettings.budgetMax !== "") {
        const minBudget = filterSettings.budgetMin !== "" ? parseFloat(filterSettings.budgetMin) : 0;
        const maxBudget = filterSettings.budgetMax !== "" ? parseFloat(filterSettings.budgetMax) : Infinity;

        if (event.budget < minBudget || event.budget > maxBudget) {
          return false;
        }
      }

      return true;
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterSettings({
      dateStart: "",
      dateEnd: "",
      budgetMin: "",
      budgetMax: "",
    });
  };

  const isFilterActive = () => {
    return searchQuery !== "" ||
           filterSettings.dateStart !== "" ||
           filterSettings.dateEnd !== "" ||
           filterSettings.budgetMin !== "" ||
           filterSettings.budgetMax !== "";
  };

  const filteredEvents = filterEvents();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Logo" className="h-12 w-auto" />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              <Button onClick={() => navigate("/events/1")} className="bg-[#6366F1] hover:bg-[#6366F1]/90">
                <Plus className="size-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="mb-2">My Events</h2>
          <p className="text-muted-foreground">Manage and track all your events in one place</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#6366F1] transition-colors"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-colors ${
                filterSettings.dateStart !== '' || filterSettings.dateEnd !== ''
                  ? 'bg-[#6366F1] border-[#6366F1] text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Calendar className="size-4" />
              <span>Срок</span>
            </button>

            {showDateFilter && (
              <div className="absolute top-14 left-0 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl z-10 w-80 border border-slate-200 dark:border-slate-700">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-gray-400 mb-1">Дата начала</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={filterSettings.dateStart}
                        onChange={(e) => setFilterSettings({ ...filterSettings, dateStart: e.target.value })}
                        placeholder="dd.mm.yyyy"
                        className="flex-1 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                      />
                      <button
                        onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                        className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                    {showStartDatePicker && (
                      <div className="mt-2">
                        <input
                          type="date"
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            setFilterSettings({ ...filterSettings, dateStart: formatDate(date) });
                            setShowStartDatePicker(false);
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-700 px-3 py-2 rounded-lg outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-gray-400 mb-1">Дата окончания</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={filterSettings.dateEnd}
                        onChange={(e) => setFilterSettings({ ...filterSettings, dateEnd: e.target.value })}
                        placeholder="dd.mm.yyyy"
                        className="flex-1 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                      />
                      <button
                        onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                        className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                    {showEndDatePicker && (
                      <div className="mt-2">
                        <input
                          type="date"
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            setFilterSettings({ ...filterSettings, dateEnd: formatDate(date) });
                            setShowEndDatePicker(false);
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-700 px-3 py-2 rounded-lg outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Budget Filter */}
          <div className="relative">
            <button
              onClick={() => setShowBudgetFilter(!showBudgetFilter)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-colors ${
                filterSettings.budgetMin !== '' || filterSettings.budgetMax !== ''
                  ? 'bg-[#6366F1] border-[#6366F1] text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>Бюджет</span>
            </button>

            {showBudgetFilter && (
              <div className="absolute top-14 left-0 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl z-10 w-80 border border-slate-200 dark:border-slate-700">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-gray-400 mb-1">От ($)</label>
                    <input
                      type="number"
                      value={filterSettings.budgetMin}
                      onChange={(e) => setFilterSettings({ ...filterSettings, budgetMin: e.target.value })}
                      placeholder="0"
                      className="w-full bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-gray-400 mb-1">До ($)</label>
                    <input
                      type="number"
                      value={filterSettings.budgetMax}
                      onChange={(e) => setFilterSettings({ ...filterSettings, budgetMax: e.target.value })}
                      placeholder="100000"
                      className="w-full bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                    />
                  </div>
                  {filterSettings.budgetMin !== "" && filterSettings.budgetMax !== "" && (
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Диапазон</label>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={filterSettings.budgetMin}
                        onChange={(e) => setFilterSettings({ ...filterSettings, budgetMin: e.target.value })}
                        className="w-full accent-[#6366F1]"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={filterSettings.budgetMax}
                        onChange={(e) => setFilterSettings({ ...filterSettings, budgetMax: e.target.value })}
                        className="w-full accent-[#6366F1] mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset Filter Button */}
          <button
            onClick={resetFilters}
            className={`px-6 py-3 rounded-xl transition-colors ${
              isFilterActive()
                ? 'bg-[#6366F1] hover:bg-[#5558E3] text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            Сбросить фильтр
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const progress = Math.round((event.tasksCompleted / event.tasksTotal) * 100);
            return (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.date}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{event.budgetDisplay}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-[#6366F1]" />
                        <span className="text-muted-foreground">Progress</span>
                      </div>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6366F1] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.tasksCompleted} of {event.tasksTotal} tasks completed
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    <span>{event.teamSize} team members</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
