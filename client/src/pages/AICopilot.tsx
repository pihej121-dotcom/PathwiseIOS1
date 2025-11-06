import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Target, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Layout } from '@/components/Layout';
import { TourButton } from '@/components/TourButton';

export function AICopilot({ embedded = false }: { embedded?: boolean } = {}) {
  const [salaryForm, setSalaryForm] = useState({
    currentSalary: '',
    targetSalary: '',
    jobRole: '',
    location: '',
    yearsExperience: ''
  });

  const { toast } = useToast();

  // Fetch active resume (still needed for AI analysis context)
  const { data: activeResume } = useQuery({
    queryKey: ['/api/resumes/active'],
  });

  // Salary negotiation mutation
  const salaryNegotiationMutation = useMutation({
    mutationFn: async (formData: typeof salaryForm) => {
      if (!(activeResume as any)?.extractedText) {
        throw new Error("Please upload a resume first");
      }

      const response = await apiRequest('POST', '/api/copilot/salary-negotiation', {
        currentSalary: formData.currentSalary
          ? parseInt(formData.currentSalary.replace(/[^0-9]/g, ''))
          : 0,
        targetSalary: parseInt(formData.targetSalary.replace(/[^0-9]/g, '')),
        jobRole: formData.jobRole,
        location: formData.location,
        yearsExperience: parseInt(formData.yearsExperience),
      });

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Negotiation Strategy Generated!',
        description: 'Your personalized salary negotiation strategy is ready.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate negotiation strategy',
        variant: 'destructive',
      });
    },
  });

  const handleGenerateSalaryStrategy = () => {
    if (
      !salaryForm.targetSalary ||
      !salaryForm.jobRole ||
      !salaryForm.location ||
      !salaryForm.yearsExperience
    ) {
      toast({
        title: 'Missing Information',
        description:
          'Please fill in all required fields (target salary, job role, location, years of experience)',
        variant: 'destructive',
      });
      return;
    }

    salaryNegotiationMutation.mutate(salaryForm);
  };

  const content = (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <TourButton tourId="salary-negotiator" />
      </div>

      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        AI Salary Negotiator
      </h2>

      <div className="max-w-2xl mx-auto">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Salary Negotiation Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Get AI-powered negotiation strategies based on your resume, experience, skills, and
              qualifications.
            </p>

            {activeResume && (
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">
                  AI will analyze your resume for:
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Years of experience and career progression</li>
                  <li>• Technical skills and certifications</li>
                  <li>• Past achievements and quantifiable results</li>
                  <li>• Industry expertise and domain knowledge</li>
                  <li>• Education and professional qualifications</li>
                </ul>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentSalary">Current Salary (Optional)</Label>
                <Input
                  id="currentSalary"
                  placeholder="e.g., $75,000"
                  value={salaryForm.currentSalary}
                  onChange={(e) => setSalaryForm((prev) => ({ ...prev, currentSalary: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="targetSalary">Target Salary</Label>
                <Input
                  id="targetSalary"
                  placeholder="e.g., $95,000"
                  value={salaryForm.targetSalary}
                  onChange={(e) => setSalaryForm((prev) => ({ ...prev, targetSalary: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="jobRole">Job Role</Label>
                <Input
                  id="jobRole"
                  placeholder="e.g., Senior Software Engineer"
                  value={salaryForm.jobRole}
                  onChange={(e) => setSalaryForm((prev) => ({ ...prev, jobRole: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={salaryForm.location}
                  onChange={(e) => setSalaryForm((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  placeholder="e.g., 5"
                  type="number"
                  value={salaryForm.yearsExperience}
                  onChange={(e) =>
                    setSalaryForm((prev) => ({ ...prev, yearsExperience: e.target.value }))
                  }
                />
              </div>

              <Button
                className="w-full"
                onClick={handleGenerateSalaryStrategy}
                disabled={
                  salaryNegotiationMutation.isPending || !(activeResume as any)?.extractedText
                }
              >
                {salaryNegotiationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : !(activeResume as any)?.extractedText ? (
                  'Upload Resume First'
                ) : (
                  'Generate Personalized Negotiation Strategy'
                )}
              </Button>

              {salaryNegotiationMutation.data && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Salary Negotiation Strategy:</h4>
                  <div className="text-sm whitespace-pre-wrap bg-background p-3 rounded border">
                    {salaryNegotiationMutation.data.strategy ||
                      'Negotiation strategy will appear here...'}
                  </div>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download Strategy
                  </Button>
                </div>
              )}

              {!activeResume && (
                <p className="text-sm text-orange-600">
                  Please upload a resume first. AI will analyze your experience, skills, and
                  qualifications to create a personalized negotiation strategy.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return embedded ? content : <Layout>{content}</Layout>;
}
