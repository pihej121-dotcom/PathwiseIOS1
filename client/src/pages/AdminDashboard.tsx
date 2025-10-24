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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
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
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { UserAnalysisDialog } from "@/components/UserAnalysisDialog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  
  // User analysis dialog state
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  
  // Group insights state
  const [groupInsights, setGroupInsights] = useState<{
    insights: string;
    generatedAt: string;
    studentsAnalyzed: number;
    totalStudents: number;
  } | null>(null);

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

  // Generate group insights mutation
  const generateGroupInsightsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/institutions/${user!.institutionId}/generate-group-insights`, {});
      return res.json();
    },
    onSuccess: (data) => {
      setGroupInsights(data);
      toast({
        title: "Group Insights Generated",
        description: `Analysis complete for ${data.studentsAnalyzed} students.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Generate Group Insights",
        description: error.message || "An error occurred while generating group insights.",
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
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
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
            {/* Group Insights Section */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    AI-Generated Group Insights
                  </CardTitle>
                  <Button
                    onClick={() => generateGroupInsightsMutation.mutate()}
                    disabled={generateGroupInsightsMutation.isPending}
                    size="sm"
                    className="gap-2"
                    data-testid="generate-group-insights-button"
                  >
                    {generateGroupInsightsMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Group Insights
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>
                  Analyze all students' resume data to identify trends, gaps, and strategic recommendations for your institution
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groupInsights ? (
                  <div className="space-y-3">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" data-testid="group-insights-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {groupInsights.insights}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/20">
                      <p className="text-xs text-muted-foreground italic">
                        Generated on {new Date(groupInsights.generatedAt).toLocaleString()}
                      </p>
                      <Badge variant="secondary" data-testid="students-analyzed-count">
                        {groupInsights.studentsAnalyzed} of {groupInsights.totalStudents} students analyzed
                      </Badge>
                    </div>
                  </div>
                ) : generateGroupInsightsMutation.isPending ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Click "Generate Group Insights" to create an AI-powered analysis of all students' resume data. This will provide institutional recommendations, identify collective strengths and gaps, and suggest resources to invest in.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

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
                  <span>Student Management</span>
                  <Badge variant="secondary" data-testid="users-count">
                    {users.length} total students
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData: any) => (
                      <TableRow 
                        key={userData.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedUser({
                            id: userData.id,
                            name: `${userData.firstName} ${userData.lastName}`,
                            email: userData.email,
                          });
                        }}
                        data-testid={`user-row-${userData.id}`}
                      >
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
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex space-x-2">
                            {!userData.isVerified && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResendVerification(userData.id);
                                }}
                                data-testid={`resend-verification-${userData.id}`}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                            {userData.id !== user?.id && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTerminateUser(userData.id);
                                }}
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
              <AlertDialogTitle>Terminate Student Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to terminate this student's account? This action will:
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
                {terminateUserMutation.isPending ? "Terminating..." : "Terminate Student"}
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
                This will send a new verification email to the student. They will need to click the link in the email to verify their account.
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

        {/* User Analysis Dialog */}
        {selectedUser && user?.institutionId && (
          <UserAnalysisDialog
            open={!!selectedUser}
            onOpenChange={(open) => {
              if (!open) setSelectedUser(null);
            }}
            userId={selectedUser.id}
            institutionId={user.institutionId}
            userName={selectedUser.name}
            userEmail={selectedUser.email}
          />
        )}
      </div>
    </Layout>
  );
}
