import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Moon, Sun, Share2 } from "lucide-react";
import { useTheme } from "next-themes";
import { EventNotes } from "./EventNotes";
import { KanbanBoard } from "./KanbanBoard";
import { ShareModal } from "./ShareModal";
import { FiltersBar } from "./FiltersBar";
import { ReportModal } from "./ReportModal";
import FilterKanban from "./FilterKanban.tsx";
import Logo from "../../../assets/Logo.svg";


const TEAM_MEMBERS = [
  { id: "1", name: "Sarah Chen", initials: "SC", color: "bg-indigo-500" },
  { id: "2", name: "Mike Johnson", initials: "MJ", color: "bg-rose-500" },
  { id: "3", name: "Emma Davis", initials: "ED", color: "bg-amber-500" },
  { id: "4", name: "Tom Wilson", initials: "TW", color: "bg-green-500" },
];

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* Header - Google Docs Style */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Breadcrumbs */}
            <div className="flex items-center gap-4">
              <img 
              src={Logo} alt="Logo" className="h-12 w-auto"
                onClick={() => navigate("/events")}
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/events")} className="cursor-pointer">
                      Events
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Wedding 2026</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Right: Avatar Stack & Share Button */}
            <div className="flex items-center gap-3">
              {/* Avatar Stack */}
              <div className="flex -space-x-2">
                {TEAM_MEMBERS.map((member) => (
                  <Avatar
                    key={member.id}
                    className={`${member.color} border-2 border-white dark:border-slate-900 ring-1 ring-slate-200 dark:ring-slate-800`}
                  >
                    <AvatarFallback className="text-white text-xs">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>

              {/* Share Button */}
              <Button
                onClick={() => setShowShareModal(true)}
                className="bg-[#6366F1] hover:bg-[#6366F1]/90"
              >
                <Share2 className="size-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Collapsible Notes Section */}
        <EventNotes />

        <FilterKanban />

      </main>

      {/* Modals */}
      <ShareModal open={showShareModal} onOpenChange={setShowShareModal} />
    </div>
  );
}
