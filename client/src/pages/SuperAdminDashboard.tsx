import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Building2, Users, Calendar, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Institution {
  id: string;
  name: string;
  contactEmail: string;
  isActive: boolean;
  createdAt: string;
  license: {
    licensedSeats: number;
    usedSeats: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    seatInfo: {
      available: boolean;
      usedSeats: number;
      totalSeats: number | null;
    };
  } | null;
  activeUsers: number;
}

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isOnboardDialogOpen, setIsOnboardDialogOpen] = useState(false);
  const [deleteInstitutionId, setDeleteInstitutionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    adminEmail: "",
    studentLimit: 50,
    licenseStart: new Date().toISOString().split('T')[0],
    licenseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const { data: institutions, isLoading } = useQuery<Institution[]>({
    queryKey: ["/api/admin/institutions"],
  });

  const onboardMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/onboard-institution", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Institution onboarded successfully!",
        description: `Admin account created for ${data.admin.email}. Welcome email sent with login credentials.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/institutions"] });
      setIsOnboardDialogOpen(false);
      setFormData({
        name: "",
        adminEmail: "",
        studentLimit: 50,
        licenseStart: new Date().toISOString().split('T')[0],
        licenseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to onboard institution",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (institutionId: string) => {
      const res = await apiRequest("DELETE", `/api/admin/institutions/${institutionId}`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Institution deleted",
        description: "The institution and all associated data have been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/institutions"] });
      setDeleteInstitutionId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete institution",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onboardMutation.mutate(formData);
  };

  const handleDelete = (institutionId: string) => {
    deleteMutation.mutate(institutionId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Super Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage institutions and admins</p>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Institutions</h2>
            <p className="text-muted-foreground mt-1">Add and manage institutions</p>
          </div>
          <Dialog open={isOnboardDialogOpen} onOpenChange={setIsOnboardDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-institution">
                <Plus className="mr-2 h-4 w-4" />
                Add Institution
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Institution</DialogTitle>
                <DialogDescription>
                  Create a new institution and automatically send the admin their login credentials via email.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Institution Name</Label>
                    <Input
                      id="name"
                      data-testid="input-institution-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="University of Example"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="adminEmail">Admin Email Address</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      data-testid="input-admin-email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      placeholder="admin@example.edu"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="studentLimit">Number of Student Seats</Label>
                    <Input
                      id="studentLimit"
                      type="number"
                      data-testid="input-student-limit"
                      min="1"
                      value={formData.studentLimit}
                      onChange={(e) => setFormData({ ...formData, studentLimit: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="licenseStart">License Start Date</Label>
                      <Input
                        id="licenseStart"
                        type="date"
                        data-testid="input-license-start"
                        value={formData.licenseStart}
                        onChange={(e) => setFormData({ ...formData, licenseStart: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="licenseEnd">License End Date</Label>
                      <Input
                        id="licenseEnd"
                        type="date"
                        data-testid="input-license-end"
                        value={formData.licenseEnd}
                        onChange={(e) => setFormData({ ...formData, licenseEnd: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOnboardDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={onboardMutation.isPending} data-testid="button-create-institution">
                    {onboardMutation.isPending ? "Creating..." : "Create Institution"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : institutions && institutions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {institutions.map((institution) => (
              <Card key={institution.id} data-testid={`card-institution-${institution.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{institution.name}</CardTitle>
                    </div>
                    {institution.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <CardDescription className="text-sm">{institution.contactEmail}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {institution.license ? (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Seats:</span>
                          <span className="font-medium">
                            {institution.license.seatInfo.usedSeats} / {institution.license.seatInfo.totalSeats || "∞"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Expires:</span>
                          <span className="font-medium">
                            {new Date(institution.license.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Active Users:</span>
                          <span className="font-medium">{institution.activeUsers}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No active license</p>
                    )}
                    <div className="pt-3 border-t">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => setDeleteInstitutionId(institution.id)}
                        data-testid={`button-delete-${institution.id}`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Institution
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No institutions yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first institution
              </p>
              <Button onClick={() => setIsOnboardDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Institution
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteInstitutionId !== null} onOpenChange={(open) => !open && setDeleteInstitutionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the institution, all associated users, licenses, and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteInstitutionId && handleDelete(deleteInstitutionId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Institution"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
