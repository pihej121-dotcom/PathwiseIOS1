import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function InstitutionAdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Institution Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your institution</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" onClick={() => logout()} data-testid="button-logout">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome, Institution Admin!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your institution admin dashboard is coming soon. You'll be able to manage students, 
              view usage statistics, and send invitations from here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
