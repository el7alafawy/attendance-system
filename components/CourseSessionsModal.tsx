"use client";

import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "@/hooks/use-toast";

// Session schema for validation
const sessionSchema = z.object({
  courseId: z.number(),
  sessionDate: z.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  topic: z.string().optional()
});

interface CourseSession {
  id: number;
  courseId: number;
  sessionDate: string;
  startTime?: string;
  endTime?: string;
  topic?: string;
}

interface Course {
  id: number;
  courseName: string;
  sessions?: CourseSession[];
}

const CourseSessionsModal = ({ 
  course, 
  isOpen, 
  onClose,
  useDummyData = false
}: { 
  course: Course, 
  isOpen: boolean, 
  onClose: () => void,
  useDummyData?: boolean
}) => {
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dummy data for sessions
  const dummySessions: CourseSession[] = [
    {
      id: 1,
      courseId: course.id,
      sessionDate: new Date().toISOString(),
      startTime: '09:00',
      endTime: '11:00',
      topic: 'Introduction to the Course'
    },
    {
      id: 2,
      courseId: course.id,
      sessionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      startTime: '10:00',
      endTime: '12:00',
      topic: 'Advanced Topics'
    }
  ];

  const form = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      courseId: course.id,
      sessionDate: new Date(),
      startTime: '',
      endTime: '',
      topic: ''
    }
  });

  useEffect(() => {
    if (isOpen && course.id) {
      if (useDummyData) {
        setSessions(dummySessions);
      } else {
        fetchCourseSessions();
      }
    }
  }, [isOpen, course.id, useDummyData]);

  const fetchCourseSessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses/${course.id}/sessions/?courseId=${course.id}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      
      const fetchedSessions = await response.json();
      setSessions(fetchedSessions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch course sessions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof sessionSchema>) => {
    setIsLoading(true);
    try {
      if (useDummyData) {
        // Simulate session creation for dummy data
        const newSession: CourseSession = {
          id: sessions.length + 1,
          courseId: course.id,
          sessionDate: data.sessionDate.toISOString(),
          startTime: data.startTime,
          endTime: data.endTime,
          topic: data.topic
        };
        setSessions([...sessions, newSession]);
        
        toast({ 
          title: "Session Created", 
          description: "New session added successfully" 
        });

        form.reset();
        return;
      }
      
      const response = await fetch(`/api/courses/${course.id}/sessions?courseId=${course.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to create session');
      
      const newSession = await response.json();
      setSessions([...sessions, newSession]);
      
      toast({ 
        title: "Session Created", 
        description: "New session added successfully" 
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    try {
      if (useDummyData) {
        // Simulate session deletion for dummy data
        setSessions(sessions.filter(session => session.id !== sessionId));
        
        toast({ 
          title: "Session Deleted", 
          description: "Session removed successfully" 
        });
        return;
      }

      const response = await fetch(`/api/courses/${course.id}/sessions/?sessionId=${sessionId}&courseId=${course.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete session');
      
      setSessions(sessions.filter(session => session.id !== sessionId));
      
      toast({ 
        title: "Session Deleted", 
        description: "Session removed successfully" 
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Manage Sessions for {course.courseName}
          </DialogTitle>
        </DialogHeader>

        {/* Session Creation Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sessionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Session Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter session topic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" /> 
              Add Session
            </Button>
          </form>
        </Form>

        {/* Sessions List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Existing Sessions
          </h3>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">No sessions created yet</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(session.sessionDate), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {session.startTime} - {session.endTime}
                    </div>
                    {session.topic && (
                      <div className="text-sm italic mt-1">
                        Topic: {session.topic}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseSessionsModal;