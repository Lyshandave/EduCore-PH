import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, CheckCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

const mockSubjects = [
  { id: 1, subject: 'Advanced Programming', code: 'CC102', teacher: 'Mr. Juan dela Cruz', status: 'Pending' },
  { id: 2, subject: 'Database Management', code: 'IT201', teacher: 'Ms. Maria Santos', status: 'Evaluated' },
];

export function TeacherEvaluationsPage() {
  const [selectedSubject, setSelectedSubject] = useState(mockSubjects[0].id.toString());
  const [ratings, setRatings] = useState({
    effectiveness: 0,
    communication: 0,
    punctuality: 0,
    knowledge: 0,
  });
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const subject = mockSubjects.find(s => s.id.toString() === selectedSubject);

  const handleRate = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    if (Object.values(ratings).some(r => r === 0)) {
      toast.error('Please complete all rating categories before submitting.');
      return;
    }
    toast.success('Evaluation submitted successfully!');
    setRatings({ effectiveness: 0, communication: 0, punctuality: 0, knowledge: 0 });
    setComment('');
  };

  if (!subject) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Teacher Evaluation
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Provide feedback for your enrolled subjects this term. Your voice matters.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {mockSubjects.map(s => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.code} - {s.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {subject.status === 'Evaluated' ? (
        <Card className="bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 dark:bg-green-900/50">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Evaluation Completed</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You have already evaluated {subject.teacher} for {subject.subject} ({subject.code}) this term. Thank you for your feedback!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{subject.subject}</CardTitle>
                <CardDescription className="text-base mt-1">
                  Teacher: <span className="font-semibold text-slate-800 dark:text-slate-200">{subject.teacher}</span> | Code: {subject.code}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                Current Term
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
            <div className="space-y-6">
              {[
                { key: 'effectiveness', label: 'Teaching Effectiveness' },
                { key: 'communication', label: 'Communication Skills' },
                { key: 'punctuality', label: 'Punctuality' },
                { key: 'knowledge', label: 'Subject Matter Knowledge' }
              ].map(category => (
                <div key={category.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{category.label}</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRate(category.key, star)}
                        className={`p-1 transition-all ${
                          (ratings[category.key as keyof typeof ratings] >= star)
                            ? 'text-yellow-400 drop-shadow-sm scale-110'
                            : 'text-slate-200 dark:text-slate-700 hover:text-yellow-200'
                        }`}
                      >
                        <Star fill="currentColor" className="h-6 w-6" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Label htmlFor="comments">Additional Comments (Optional)</Label>
              <Textarea 
                id="comments"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any other thoughts about the teacher's performance..."
                className="h-32 resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center space-x-2">
              <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              <Label htmlFor="anonymous" className="text-slate-500">Submit Anonymously</Label>
            </div>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              Submit Evaluation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
