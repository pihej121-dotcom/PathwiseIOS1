import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  Crown, 
  CheckCircle, 
  Clock, 
  XCircle,
  Trash2,
  Ban,
  Mail,
  Upload,
  FileUp,
  Eye,
  TrendingUp,
  Target,
  Building2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  
  // Single invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("student");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Bulk invite state
  const [bulkEmails, setBulkEmails] = useState("");
  const [bulkRole, setBulkRole] = useState("student");
  const [isBulkInviteDialogOpen, setIsBulkInviteDialogOpen] = useState(false);
  
  // User management state
  const [userToTerminate, setUserToTerminate] = useState<string | null>(null);
  const [userToResendVerification, setUserToResendVerification] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch institution overview data
  const { data: institutionData, isLoading } = useQuery({
    queryKey: [`/api/institutions/${user?.institutionId}`],
    enabled: !!user?.institutionId && (user?.role === "admin" || user?.role === "super_admin"),
  });
  
  // Fetch users and invitations separately for better performance
  const { data: usersData } = useQuery({
    queryKey: [`/api/institutions/${user?.institutionId}/users`],
    enabled: !!user?.institutionId && (user?.role === "admin" || user?.role === "super_admin"),
  });
  
  const { data: invitationsData } = useQuery({
    queryKey: [`/api/institutions/${user?.institutionId}/invitations`],
    enabled: !!user?.institutionId && (user?.role === "admin" || user?.role === "super_admin"),
  });
  
  // Fetch detailed student information
  const { data: studentDetails, isLoading: isLoadingStudentDetails, error: studentDetailsError } = useQuery({
    queryKey: [`/api/institutions/${user?.institutionId}/users/${selectedUserId}/details`],
    enabled: !!selectedUserId && !!user?.institutionId,
    retry: 1,
  });
  

  // Single invite mutation
  const inviteUserMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      return apiRequest("POST", `/api/institutions/${user!.institutionId}/invite`, { email, role });
    },
    onSuccess: () => {
      toast({
        title: "Invitation sent",
        description: "The user will receive an email invitation to join your institution.",
      });
      setInviteEmail("");
      setIsInviteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/institutions/${user?.institutionId}/invitations`] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send invitation",
        description: error.message || "There was an error sending the invitation.",
        variant: "destructive",
      });
    },
  });
  
  // Bulk invite mutation
  const bulkInviteUsersMutation = useMutation({
    mutationFn: async ({ emails, role }: { emails: string[]; role: string }) => {
      return apiRequest("POST", `/api/institutions/${user!.institutionId}/bulk-invite`, { emails, role });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Bulk invitations sent",
        description: `Successfully sent ${data.success || 0} invitations. ${data.failed || 0} failed.`,
      });
      setBulkEmails("");
      setIsBulkInviteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/institutions/${user?.institutionId}/invitations`] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send bulk invitations",
        description: error.message || "There was an error sending the bulk invitations.",
        variant: "destructive",
      });
    },
  });
  

  // Terminate user mutation
  const terminateUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("DELETE", `/api/institutions/${user!.institutionId}/users/${userId}`);
    },
    onSuccess: () => {
      toast({
        title: "User terminated",
        description: "The user account has been deactivated and access revoked.",
      });
      setUserToTerminate(null);
      queryClient.invalidateQueries({ queryKey: [`/api/institutions/${user?.institutionId}/users`] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to terminate user",
        description: error.message || "There was an error terminating the user.",
        variant: "destructive",
      });
    },
  });

  // Cancel invitation mutation
  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      return apiRequest("DELETE", `/api/institutions/${user!.institutionId}/invitations/${invitationId}`);
    },
    onSuccess: () => {
      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled and can no longer be used.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/institutions/${user?.institutionId}/invitations`] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to cancel invitation",
        description: error.message || "There was an error cancelling the invitation.",
        variant: "destructive",
      });
    },
  });

  // Resend verification mutation
  const resendVerificationMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("POST", `/api/institutions/${user!.institutionId}/users/${userId}/resend-verification`);
    },
    onSuccess: () => {
      toast({
        title: "Verification email sent",
        description: "The user will receive a new verification email.",
      });
      setUserToResendVerification(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send verification email",
        description: error.message || "There was an error sending the verification email.",
        variant: "destructive",
      });
    },
  });

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return (
      <Layout>
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const users = (usersData as any)?.users || [];
  const invitations = (invitationsData as any)?.invitations || [];
  const institution = (institutionData as any)?.institution;

  // Determine default tab based on URL
  const getDefaultTab = () => {
    if (location.includes('/admin/invitations')) return 'invitations';
    if (location.includes('/admin/users')) return 'users';
    return 'overview';
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail && inviteRole) {
      inviteUserMutation.mutate({ email: inviteEmail, role: inviteRole });
    }
  };

  const handleBulkInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkEmails.trim()) {
      const emails = bulkEmails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));
      
      if (emails.length > 0) {
        bulkInviteUsersMutation.mutate({ emails, role: bulkRole });
      }
    }
  };


  const handleTerminateUser = (userId: string) => {
    setUserToTerminate(userId);
  };

  const confirmTerminate = () => {
    if (userToTerminate) {
      terminateUserMutation.mutate(userToTerminate);
    }
  };

  const handleCancelInvitation = (invitationId: string) => {
    cancelInvitationMutation.mutate(invitationId);
  };

  const handleResendVerification = (userId: string) => {
    setUserToResendVerification(userId);
  };

  const confirmResendVerification = () => {
    if (userToResendVerification) {
      resendVerificationMutation.mutate(userToResendVerification);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="admin-dashboard-title">
              Institutional Management
            </h1>
            <p className="text-muted-foreground">
              Access control, licensing, and user lifecycle management for {institution?.name || 'your institution'}
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="active-users">
                {users.filter((u: any) => u.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {users.length} total accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="pending-invitations">
                {invitations.filter((inv: any) => inv.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting registration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="total-accounts">
                {users.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {users.filter((u: any) => !u.isVerified).length} pending verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue={getDefaultTab()} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="invitations" data-testid="tab-invitations">Invitations</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" data-testid="quick-invite-button">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite New User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite New User</DialogTitle>
                        <DialogDescription>
                          Send an email invitation to join your institution
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleInviteSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="inviteEmail">Email Address</Label>
                          <Input
                            id="inviteEmail"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="user@university.edu"
                            required
                            data-testid="invite-email-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inviteRole">Role</Label>
                          <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger data-testid="invite-role-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={inviteUserMutation.isPending}
                          data-testid="send-invitation-button"
                        >
                          {inviteUserMutation.isPending ? "Sending..." : "Send Invitation"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">System operational</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{invitations.filter((inv: any) => inv.status === "pending").length} pending invitations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">{users.filter((u: any) => u.isActive).length} active users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single Invite */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Single Invitation</span>
                  </CardTitle>
                  <CardDescription>
                    Send an email invitation to one user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" data-testid="single-invite-button">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Send Single Invitation
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite New User</DialogTitle>
                        <DialogDescription>
                          Send an email invitation to join your institution
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleInviteSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="inviteEmail">Email Address</Label>
                          <Input
                            id="inviteEmail"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="user@university.edu"
                            required
                            data-testid="invite-email-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inviteRole">Role</Label>
                          <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger data-testid="invite-role-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={inviteUserMutation.isPending}
                          data-testid="send-invitation-button"
                        >
                          {inviteUserMutation.isPending ? "Sending..." : "Send Invitation"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Bulk Invite */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileUp className="h-5 w-5" />
                    <span>Bulk Invitations</span>
                  </CardTitle>
                  <CardDescription>
                    Send invitations to multiple users via CSV format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isBulkInviteDialogOpen} onOpenChange={setIsBulkInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" data-testid="bulk-invite-button">
                        <Upload className="h-4 w-4 mr-2" />
                        Bulk Invite Users
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Bulk Invite Users</DialogTitle>
                        <DialogDescription>
                          Enter email addresses separated by commas or new lines
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleBulkInviteSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="bulkEmails">Email Addresses</Label>
                          <Textarea
                            id="bulkEmails"
                            value={bulkEmails}
                            onChange={(e) => setBulkEmails(e.target.value)}
                            placeholder="user1@university.edu&#10;user2@university.edu&#10;user3@university.edu"
                            rows={6}
                            required
                            data-testid="bulk-emails-input"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            One email per line or separated by commas
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="bulkRole">Role for All Users</Label>
                          <Select value={bulkRole} onValueChange={setBulkRole}>
                            <SelectTrigger data-testid="bulk-role-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={bulkInviteUsersMutation.isPending}
                          data-testid="send-bulk-invitations-button"
                        >
                          {bulkInviteUsersMutation.isPending ? "Sending..." : "Send Bulk Invitations"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Pending Invitations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Invitations</span>
                  <Badge variant="secondary" data-testid="invitations-count">
                    {invitations.filter((inv: any) => inv.status === "pending").length} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations
                      .filter((invitation: any) => invitation.status === "pending")
                      .map((invitation: any) => (
                        <TableRow key={invitation.id}>
                          <TableCell data-testid={`invitation-email-${invitation.id}`}>
                            {invitation.email}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={invitation.role === "admin" ? "default" : "secondary"}
                              data-testid={`invitation-role-${invitation.id}`}
                            >
                              {invitation.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" data-testid={`invitation-status-${invitation.id}`}>
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`invitation-created-${invitation.id}`}>
                            {new Date(invitation.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell data-testid={`invitation-expires-${invitation.id}`}>
                            {new Date(invitation.expiresAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelInvitation(invitation.id)}
                              disabled={cancelInvitationMutation.isPending}
                              data-testid={`cancel-invitation-${invitation.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Management</span>
                  <Badge variant="secondary" data-testid="users-count">
                    {users.length} total users
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData: any) => (
                      <TableRow key={userData.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium" data-testid={`user-name-${userData.id}`}>
                              {userData.firstName} {userData.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground" data-testid={`user-email-${userData.id}`}>
                              {userData.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={userData.role === "admin" ? "default" : "secondary"}
                            data-testid={`user-role-${userData.id}`}
                          >
                            {userData.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={userData.isActive ? "default" : "destructive"}
                            data-testid={`user-status-${userData.id}`}
                          >
                            {userData.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={userData.isVerified ? "default" : "secondary"}
                            data-testid={`user-verified-${userData.id}`}
                          >
                            {userData.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`user-last-activity-${userData.id}`}>
                          {userData.lastActivityAt 
                            ? new Date(userData.lastActivityAt).toLocaleDateString()
                            : "Never"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {userData.role === "student" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUserId(userData.id)}
                                data-testid={`view-details-${userData.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {!userData.isVerified && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResendVerification(userData.id)}
                                data-testid={`resend-verification-${userData.id}`}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                            {userData.id !== user?.id && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleTerminateUser(userData.id)}
                                data-testid={`terminate-user-${userData.id}`}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialogs */}
        
        {/* Terminate User Dialog */}
        <AlertDialog open={!!userToTerminate} onOpenChange={() => setUserToTerminate(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Terminate User Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to terminate this user's account? This action will:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Deactivate their account immediately</li>
                  <li>Revoke all active sessions</li>
                  <li>Free up their license seat</li>
                  <li>Prevent them from accessing the platform</li>
                </ul>
                <strong className="text-destructive">This action cannot be undone.</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="cancel-terminate">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmTerminate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={terminateUserMutation.isPending}
                data-testid="confirm-terminate"
              >
                {terminateUserMutation.isPending ? "Terminating..." : "Terminate User"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Resend Verification Dialog */}
        <AlertDialog open={!!userToResendVerification} onOpenChange={() => setUserToResendVerification(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resend Verification Email</AlertDialogTitle>
              <AlertDialogDescription>
                This will send a new verification email to the user. They will need to click the link in the email to verify their account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="cancel-resend">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmResendVerification}
                disabled={resendVerificationMutation.isPending}
                data-testid="confirm-resend"
              >
                {resendVerificationMutation.isPending ? "Sending..." : "Send Verification Email"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Student Details Dialog */}
        <Dialog open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Student Details</DialogTitle>
              <DialogDescription>
                Comprehensive view of student profile and resume analysis
              </DialogDescription>
            </DialogHeader>

            {isLoadingStudentDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : studentDetailsError ? (
              <div className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h3 className="font-semibold mb-2">Failed to Load Student Details</h3>
                <p className="text-sm text-muted-foreground">
                  {(studentDetailsError as any)?.message || "An error occurred while fetching student information."}
                </p>
                <Button 
                  onClick={() => setSelectedUserId(null)} 
                  variant="outline" 
                  className="mt-4"
                  data-testid="close-error-dialog"
                >
                  Close
                </Button>
              </div>
            ) : studentDetails && (studentDetails as any).user ? (
              <div className="space-y-6">
                {/* Student Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Profile Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="font-medium" data-testid="detail-student-name">
                        {(studentDetails as any).user?.firstName || "N/A"} {(studentDetails as any).user?.lastName || ""}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium" data-testid="detail-student-email">{(studentDetails as any).user.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">School</Label>
                      <p className="font-medium" data-testid="detail-student-school">{(studentDetails as any).user.school || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Major</Label>
                      <p className="font-medium" data-testid="detail-student-major">{(studentDetails as any).user.major || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Graduation Year</Label>
                      <p className="font-medium" data-testid="detail-student-grad-year">{(studentDetails as any).user.gradYear || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Location</Label>
                      <p className="font-medium" data-testid="detail-student-location">{(studentDetails as any).user.location || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Career Targets */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Career Targets</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>Target Role</span>
                      </Label>
                      <p className="font-medium text-lg" data-testid="detail-target-role">
                        {(studentDetails as any).resume?.targetRole || (studentDetails as any).user.targetRole || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>Target Industry</span>
                      </Label>
                      <p className="font-medium" data-testid="detail-target-industry">
                        {(studentDetails as any).resume?.targetIndustry || 
                         ((studentDetails as any).user.industries && (studentDetails as any).user.industries.length > 0 
                           ? (studentDetails as any).user.industries.join(", ") 
                           : "Not specified")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>Target Companies</span>
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {((studentDetails as any).resume?.targetCompanies || (studentDetails as any).user.targetCompanies || []).length > 0 ? (
                          ((studentDetails as any).resume?.targetCompanies || (studentDetails as any).user.targetCompanies || []).map((company: string, idx: number) => (
                            <Badge key={idx} variant="secondary" data-testid={`detail-company-${idx}`}>
                              {company}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Not specified</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resume Analysis */}
                {(studentDetails as any).resume ? (
                  <>
                    {/* RMS Score Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5" />
                            <span>Resume Analysis Score</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground" data-testid="detail-analysis-date">
                              {new Date((studentDetails as any).resume.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center py-4">
                            <div className="text-5xl font-bold text-primary" data-testid="detail-rms-score">
                              {(studentDetails as any).resume.rmsScore || 0}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">RMS Score (out of 100)</p>
                          </div>

                          {/* Subsection Scores */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm">Skills</Label>
                                <span className="font-semibold" data-testid="detail-skills-score">
                                  {(studentDetails as any).resume.skillsScore || 0}
                                </span>
                              </div>
                              <Progress value={(studentDetails as any).resume.skillsScore || 0} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm">Experience</Label>
                                <span className="font-semibold" data-testid="detail-experience-score">
                                  {(studentDetails as any).resume.experienceScore || 0}
                                </span>
                              </div>
                              <Progress value={(studentDetails as any).resume.experienceScore || 0} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm">Keywords</Label>
                                <span className="font-semibold" data-testid="detail-keywords-score">
                                  {(studentDetails as any).resume.keywordsScore || 0}
                                </span>
                              </div>
                              <Progress value={(studentDetails as any).resume.keywordsScore || 0} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm">Education</Label>
                                <span className="font-semibold" data-testid="detail-education-score">
                                  {(studentDetails as any).resume.educationScore || 0}
                                </span>
                              </div>
                              <Progress value={(studentDetails as any).resume.educationScore || 0} className="h-2" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm">Certifications</Label>
                                <span className="font-semibold" data-testid="detail-certifications-score">
                                  {(studentDetails as any).resume.certificationsScore || 0}
                                </span>
                              </div>
                              <Progress value={(studentDetails as any).resume.certificationsScore || 0} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Insights */}
                    {(studentDetails as any).resume.overallInsights && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5" />
                            <span>AI Insights</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <div className="bg-muted/50 p-4 rounded-lg" data-testid="detail-overall-insights">
                              {typeof (studentDetails as any).resume.overallInsights === 'string' 
                                ? (studentDetails as any).resume.overallInsights
                                : JSON.stringify((studentDetails as any).resume.overallInsights, null, 2)}
                            </div>
                          </div>

                          {(studentDetails as any).resume.sectionAnalysis && (
                            <div className="space-y-3">
                              <Label className="font-semibold">Section Analysis</Label>
                              <div className="bg-muted/30 p-4 rounded-lg max-h-96 overflow-y-auto" data-testid="detail-section-analysis">
                                <pre className="text-sm whitespace-pre-wrap">
                                  {typeof (studentDetails as any).resume.sectionAnalysis === 'string'
                                    ? (studentDetails as any).resume.sectionAnalysis
                                    : JSON.stringify((studentDetails as any).resume.sectionAnalysis, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">No Resume Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        This student has not uploaded or analyzed a resume yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Failed to load student details</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}