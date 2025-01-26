"use client";

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "@/hooks/use-toast";

// Student schema for validation
const studentSchema = z.object({
  academicNumber: z.string()
    .min(5, { message: "Academic Number must be at least 5 characters" })
    .max(20, { message: "Academic Number cannot exceed 20 characters" }),
  studentName: z.string()
    .min(3, { message: "Student Name must be at least 3 characters" })
    .max(50, { message: "Student Name cannot exceed 50 characters" })
});

interface Student {
  id: string;
  academicNumber: string;
  studentName: string;
}

const StudentsManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch students",
        variant: "destructive"
      });
    }
  };

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      academicNumber: '',
      studentName: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof studentSchema>) => {
    try {
      if (editingStudent) {
        // Update existing student
        const response = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to update student');
        
        const updatedStudent = await response.json();
        setStudents(students.map(student => 
          student.id === editingStudent.id ? updatedStudent : student
        ));
        
        toast({ title: "Student Updated", description: "Student successfully updated" });
      } else {
        // Create new student
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to create student');
        
        const newStudent = await response.json();
        setStudents([...students, newStudent]);
        
        toast({ title: "Student Created", description: "New student added successfully" });
      }
      
      // Reset form and close dialog
      form.reset();
      setDialogOpen(false);
      setEditingStudent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete student');
      
      setStudents(students.filter(student => student.id !== studentId));
      toast({ title: "Student Deleted", description: "Student removed successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    form.reset({
      academicNumber: student.academicNumber,
      studentName: student.studentName
    });
    setDialogOpen(true);
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <GraduationCap className="h-8 w-8" /> Students Management
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                form.reset();
                setEditingStudent(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="academicNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter academic number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setDialogOpen(false);
                      form.reset();
                    }}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> 
                    {editingStudent ? 'Update' : 'Save'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Students Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Academic Number</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.id}</TableCell>
              <TableCell>{student.academicNumber}</TableCell>
              <TableCell>{student.studentName}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleEdit(student)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDelete(student.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsManagement;