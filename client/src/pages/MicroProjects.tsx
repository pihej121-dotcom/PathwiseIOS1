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
import type { 
  Deliverable, 
  ResourceLink, 
  ProjectInstructions, 
  CoreFeature, 
  WeekPlan 
} from "@shared/schema";

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
  instructions?: ProjectInstructions;
  createdAt?: string;
  updatedAt?: string;
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
            <div className="grid grid-cols-1 gap-6">
              {allProjects.map((project) => {
                const status = getProjectStatus(project.id);
                const isStarted = status !== "not_started";
                const hasComprehensiveFormat = project.instructions && (
                  project.instructions.whyEmployersLove?.length ||
                  project.instructions.techStack?.frontend?.length ||
                  project.instructions.coreFeatures?.length
                );
                
                return (
                  <div key={project.id} className="rounded-md border border-border overflow-hidden" data-testid={`project-card-${project.id}`}>
                    {/* Comprehensive Format */}
                    {hasComprehensiveFormat ? (
                      <div className="space-y-6 p-6">
                        {/* Header */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Target className="w-4 h-4" />
                                <span>Complete Project Specification</span>
                              </div>
                              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                            <Badge className={getDifficultyColor(project.difficultyLevel)}>
                              {project.difficultyLevel}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              <span>{project.targetRole}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{project.estimatedHours} hours</span>
                            </div>
                          </div>
                        </div>

                        {/* Why Employers Love This Project */}
                        {project.instructions?.whyEmployersLove && project.instructions.whyEmployersLove.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Why Employers Love This Project
                            </h4>
                            <div className="space-y-2">
                              {project.instructions.whyEmployersLove.map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tech Stack & Architecture */}
                        {project.instructions?.techStack && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Tech Stack & Architecture
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {project.instructions.techStack.frontend && project.instructions.techStack.frontend.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold">Frontend</p>
                                  <div className="flex flex-wrap gap-2">
                                    {project.instructions.techStack.frontend.map((tech, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">{tech}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {project.instructions.techStack.backend && project.instructions.techStack.backend.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold">Backend</p>
                                  <div className="flex flex-wrap gap-2">
                                    {project.instructions.techStack.backend.map((tech, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">{tech}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Core Features to Build */}
                        {project.instructions?.coreFeatures && project.instructions.coreFeatures.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold">Core Features to Build</h4>
                            <div className="space-y-3">
                              {project.instructions.coreFeatures.map((feature, idx) => (
                                <div key={idx} className="border-l-2 border-primary pl-4 space-y-2">
                                  <p className="text-sm font-semibold">{idx + 1}. {feature.title}</p>
                                  {feature.details && feature.details.length > 0 && (
                                    <div className="space-y-1">
                                      {feature.details.map((detail, detailIdx) => (
                                        <div key={detailIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <span className="text-xs">○</span>
                                          <span>{detail}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Implementation Plan */}
                        {project.instructions?.implementationPlan && project.instructions.implementationPlan.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold">Implementation Plan</h4>
                            <div className="space-y-3">
                              {project.instructions.implementationPlan.map((week, idx) => (
                                <div key={idx} className="p-3 rounded-md bg-muted/30 space-y-2">
                                  <Badge variant="outline" className="text-xs">Week {week.week}</Badge>
                                  <p className="text-sm font-semibold">{week.title}</p>
                                  {week.tasks && week.tasks.length > 0 && (
                                    <div className="space-y-1 pl-3">
                                      {week.tasks.map((task, taskIdx) => (
                                        <div key={taskIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <span className="text-xs">•</span>
                                          <span>{task}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills You'll Master */}
                        {project.instructions?.skillsMastered && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold">Skills You'll Master</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {project.instructions.skillsMastered.technicalSkills && project.instructions.skillsMastered.technicalSkills.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold">Technical Skills</p>
                                  <div className="space-y-1">
                                    {project.instructions.skillsMastered.technicalSkills.map((skill, idx) => (
                                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                        <span>{skill}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {project.instructions.skillsMastered.systemDesign && project.instructions.skillsMastered.systemDesign.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold">System Design</p>
                                  <div className="space-y-1">
                                    {project.instructions.skillsMastered.systemDesign.map((skill, idx) => (
                                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                        <span>{skill}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Steps */}
                        {project.deliverables && Array.isArray(project.deliverables) && project.deliverables.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold">Steps:</h4>
                            <div className="space-y-3">
                              {project.deliverables.map((deliverable, idx) => (
                                <div key={idx} className="flex gap-3 text-sm">
                                  <span className="flex-shrink-0 font-semibold text-muted-foreground">{deliverable.stepNumber || idx + 1}</span>
                                  <div className="flex-1 space-y-1">
                                    <p>{deliverable.instruction}</p>
                                    {deliverable.resourceLinks && deliverable.resourceLinks.length > 0 && (
                                      <div className="flex flex-wrap gap-2">
                                        {deliverable.resourceLinks.map((resource, resIdx) => (
                                          <a
                                            key={resIdx}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                            data-testid={`resource-link-${idx}-${resIdx}`}
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                            {resource.title}
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resources Provided */}
                        {project.instructions?.resourcesProvided && project.instructions.resourcesProvided.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold">Resources Provided</h4>
                            <div className="space-y-2">
                              {project.instructions.resourcesProvided.map((resource, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{resource}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-3 border-t">
                          {!isStarted ? (
                            <Button
                              onClick={() => startProject(project.id)}
                              className="w-full"
                              size="lg"
                              data-testid={`button-start-${project.id}`}
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start Project
                            </Button>
                          ) : status === "completed" ? (
                            <Button variant="outline" disabled className="w-full" size="lg">
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Completed
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full" size="lg" data-testid={`button-continue-${project.id}`}>
                              Continue Project
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Simplified fallback format for projects without comprehensive data */
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                          <Badge className={getDifficultyColor(project.difficultyLevel)}>
                            {project.difficultyLevel}
                          </Badge>
                        </div>

                        {project.deliverables && project.deliverables.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Steps:</h4>
                            {project.deliverables.map((deliverable, idx) => (
                              <div key={idx} className="flex gap-2 text-sm">
                                <span className="font-semibold">{idx + 1}.</span>
                                <p>{deliverable.instruction}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <Button
                          onClick={() => startProject(project.id)}
                          className="w-full"
                          data-testid={`button-start-${project.id}`}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Project
                        </Button>
                      </div>
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
