import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TourButton } from "@/components/TourButton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Briefcase, 
  CheckCircle2, 
  PlayCircle, 
  Loader2, 
  Sparkles,
  ExternalLink,
  Award,
  Target,
  Clock,
  Trash2
} from "lucide-react";
import { LoadingExperience } from "@/components/LoadingExperience";
import { FeatureGate } from "@/components/FeatureGate";

// Updated interface matching new schema
interface MicroProject {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  targetSkill?: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  deliverables: Deliverable[];
  skillsGained: string[];
  relevanceToRole: string;
  projectType: string;
  tags?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Deliverable {
  stepNumber: number;
  instruction: string;
  resourceLinks: ResourceLink[];
}

interface ResourceLink {
  title: string;
  url: string;
  type: string;
}

interface ProjectCompletion {
  id: string;
  projectId: string;
  userId: string;
  status: "not_started" | "in_progress" | "completed";
  progressPercentage: number;
  timeSpent: number;
  reflectionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MicroProjects({ embedded = false }: { embedded?: boolean }) {
  const { toast } = useToast();
  const [targetRole, setTargetRole] = useState("Data Scientist");
  const [projectCount, setProjectCount] = useState(2);
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  // Fetch all projects (role-based generation will add to this list)
  const { data: allProjects = [], isLoading: projectsLoading } = useQuery<MicroProject[]>({
    queryKey: ["/api/micro-projects"],
  });

  // Fetch user project completions
  const { data: completions = [], isLoading: completionsLoading } = useQuery<ProjectCompletion[]>({
    queryKey: ["/api/project-completions"],
  });

  // Role-based project generation mutation
  const generateProjects = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/micro-projects/generate-from-role', {
        targetRole,
        count: projectCount,
        difficulty
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/micro-projects'] });
      toast({
        title: "Projects Generated!",
        description: `Generated ${data.projects.length} ${difficulty} project(s) for ${targetRole}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate projects. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear all projects mutation
  const clearProjects = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/micro-projects/clear');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/micro-projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/project-completions'] });
      toast({
        title: "Projects Cleared",
        description: "All projects have been successfully removed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Clear Failed",
        description: "Failed to clear projects. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/micro-projects/${projectId}/start`, {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) throw new Error('Failed to start project');
      
      queryClient.invalidateQueries({ queryKey: ["/api/project-completions"] });
      toast({
        title: "Project Started!",
        description: "Your micro-project has been started. Good luck!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "intermediate": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "advanced": return "bg-red-500/10 text-red-700 dark:text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "in_progress": return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getProjectStatus = (projectId: string) => {
    const completion = completions.find(c => c.projectId === projectId);
    return completion?.status || "not_started";
  };

  const loadingContent = (
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Loading micro-projects...</p>
    </div>
  );

  if (projectsLoading || completionsLoading) {
    return embedded ? loadingContent : (
      <Layout title="Micro-Projects" subtitle="Build portfolio-ready projects for your target role">
        {loadingContent}
      </Layout>
    );
  }

  const content = (
    <>
      <LoadingExperience 
        isLoading={generateProjects.isPending} 
        operation="projects"
      />
      
      <div className="flex justify-end mb-4">
        <TourButton tourId="micro-projects" />
      </div>
      <div className="space-y-8" data-testid="micro-projects-page">

        {/* Project Generation Section */}
        <div className="p-6 rounded-md border border-border hover-elevate transition-all">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Generate Projects for Your Target Role</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get AI-generated micro-projects with actionable steps, real resources, and portfolio deliverables
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="targetRole" className="text-sm font-medium">Target Role</label>
                <Input
                  id="targetRole"
                  placeholder="e.g., Data Scientist, Product Manager, Software Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  data-testid="input-target-role"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="projectCount" className="text-sm font-medium">Number of Projects</label>
                <Input
                  id="projectCount"
                  type="number"
                  min="1"
                  max="3"
                  value={projectCount}
                  onChange={(e) => setProjectCount(parseInt(e.target.value) || 2)}
                  data-testid="input-project-count"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="difficulty" className="text-sm font-medium">Difficulty</label>
                <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                  <SelectTrigger id="difficulty" data-testid="select-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={() => generateProjects.mutate()}
              disabled={generateProjects.isPending || !targetRole.trim()}
              className="w-full md:w-auto"
              data-testid="button-generate-projects"
            >
              {generateProjects.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Projects
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Available Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold" data-testid="projects-section-title">
              Available Projects ({allProjects.length})
            </h2>
            {allProjects.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => clearProjects.mutate()}
                disabled={clearProjects.isPending}
                data-testid="button-clear-projects"
              >
                {clearProjects.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Projects
                  </>
                )}
              </Button>
            )}
          </div>
          
          {allProjects.length === 0 ? (
            <div className="py-12 text-center border border-border rounded-md">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">
                Generate your first micro-project by entering your target role above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {allProjects.map((project) => {
                const status = getProjectStatus(project.id);
                const isStarted = status !== "not_started";
                
                return (
                  <div key={project.id} className="p-6 rounded-md border border-border hover-elevate transition-all space-y-4" data-testid={`project-card-${project.id}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end flex-shrink-0">
                        <Badge className={getDifficultyColor(project.difficultyLevel)}>
                          {project.difficultyLevel}
                        </Badge>
                        {isStarted && (
                          <Badge className={getStatusColor(status)}>
                            {status.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span>{project.targetRole}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>~{project.estimatedHours} hours</span>
                      </div>
                    </div>

                    {/* Skills Gained */}
                    {project.skillsGained && project.skillsGained.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <Award className="w-3.5 h-3.5" />
                          Skills Gained
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.skillsGained.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs" data-testid={`skill-badge-${idx}`}>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deliverables */}
                    {project.deliverables && Array.isArray(project.deliverables) && project.deliverables.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold">Steps:</h4>
                        <div className="space-y-3">
                          {project.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="text-sm space-y-1.5">
                              <div className="flex gap-2">
                                <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                  {deliverable.stepNumber || idx + 1}
                                </span>
                                <p className="flex-1">{deliverable.instruction}</p>
                              </div>
                              {deliverable.resourceLinks && deliverable.resourceLinks.length > 0 && (
                                <div className="ml-7 flex flex-wrap gap-2">
                                  {deliverable.resourceLinks.map((resource, resIdx) => (
                                    <a
                                      key={resIdx}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                      data-testid={`resource-link-${idx}-${resIdx}`}
                                    >
                                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                      {resource.title}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Relevance */}
                    {project.relevanceToRole && (
                      <p className="text-xs text-muted-foreground italic border-t pt-3">
                        {project.relevanceToRole}
                      </p>
                    )}

                    {/* Action Button */}
                    {!isStarted ? (
                      <Button
                        onClick={() => startProject(project.id)}
                        className="w-full"
                        data-testid={`button-start-${project.id}`}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Project
                      </Button>
                    ) : status === "completed" ? (
                      <Button variant="outline" disabled className="w-full">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Completed
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" data-testid={`button-continue-${project.id}`}>
                        Continue Project
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const wrappedContent = (
    <FeatureGate featureKey="micro_project_generator">
      {content}
    </FeatureGate>
  );

  return embedded ? wrappedContent : (
    <Layout title="Micro-Projects" subtitle="Build portfolio-ready projects for your target role">
      {wrappedContent}
    </Layout>
  );
}
