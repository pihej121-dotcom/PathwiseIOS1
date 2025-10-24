import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserSettingsDialog } from "@/components/UserSettingsDialog";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  FileText, 
  Route, 
  Briefcase, 
  Wand2, 
  CheckSquare, 
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  UserPlus,
  Crown,
  Zap,
  Menu,
  User,
  Moon,
  Sun,
  Heart
} from "lucide-react";

const studentNavigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, requiresPaid: false },
  { name: "Resume Analysis", href: "/resume", icon: FileText, requiresPaid: false },
  { name: "Career Roadmap", href: "/roadmap", icon: Route, requiresPaid: true },
  { name: "Job Matching", href: "/jobs", icon: Briefcase, requiresPaid: true },
  { name: "Micro-Projects", href: "/micro-projects", icon: Zap, requiresPaid: true },
  { name: "AI Career Copilot", href: "/ai-copilot", icon: Wand2, requiresPaid: false },
  { name: "Applications", href: "/applications", icon: CheckSquare, requiresPaid: true },
  { name: "Interview Prep", href: "/interview-prep", icon: MessageSquare, requiresPaid: true },
];

const adminNavigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Shield },
  { name: "Invitations", href: "/admin/invitations", icon: UserPlus },
  { name: "License Management", href: "/admin/license", icon: Crown },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function DropdownNav() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const userRole = user?.role;
  const isStudent = userRole === "student";
  const isAdmin = userRole === "admin" || userRole === "super_admin";

  const { data: institutionData } = useQuery({
    queryKey: [`/api/institutions/${user?.institutionId}`],
    enabled: !!user?.institutionId && isAdmin,
  });

  const institution = (institutionData as any)?.institution;

  const getInitials = (firstName?: string, lastName?: string, institutionName?: string) => {
    if (isAdmin && institutionName) {
      const words = institutionName.split(' ');
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return institutionName.slice(0, 2).toUpperCase();
    }
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const displayName = isAdmin && institution?.name ? institution.name : `${user?.firstName} ${user?.lastName}`;

  const navigationItems = isStudent 
    ? studentNavigation.filter((item) => {
        const tier = user?.subscriptionTier;
        if (item.requiresPaid && tier === "free") {
          return false;
        }
        return true;
      })
    : isAdmin 
    ? adminNavigation 
    : [];

  const handleNavigate = (href: string) => {
    setLocation(href);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Logo size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">Institution Edition</p>
            </div>
          </div>

          {/* Theme Toggle and Dropdown Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
              data-testid="button-theme-toggle"
              title={theme === "light" ? "Switch to dark mode" : theme === "dark" ? "Switch to pink mode" : "Switch to light mode"}
            >
              {theme === "dark" ? (
                <Heart className="h-4 w-4" />
              ) : theme === "pink" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2"
                  data-testid="button-menu"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white font-semibold text-xs">
                      {getInitials(user?.firstName, user?.lastName, institution?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">
                    {displayName}
                  </span>
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {/* User Info */}
              <DropdownMenuLabel>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white font-semibold text-sm">
                      {getInitials(user?.firstName, user?.lastName, institution?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate" data-testid="user-name">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate" data-testid="user-major">
                      {isAdmin 
                        ? userRole === "super_admin" ? "Super Admin" : "Admin"
                        : user?.major || "Student"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />

              {/* Settings */}
              <DropdownMenuItem
                onClick={() => {
                  setSettingsOpen(true);
                  setMenuOpen(false);
                }}
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>

              {/* Logout */}
              <DropdownMenuItem
                onClick={logout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16" />

      <UserSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
