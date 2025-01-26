import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  FileSpreadsheet, 
  QrCode
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import * as XLSX from 'xlsx';
import QRCode from 'react-qr-code';

// Type Definitions (based on Prisma schema)
interface Professor {
  id: number;
  name: string;
}

interface Course {
  id: number;
  courseName: string;
  professorId: number;
}

interface Student {
  id: number;
  academicNumber: string;
  studentName: string;
}

interface CourseSession {
  id: number;
  courseId: number;
  sessionDate: Date;
}

interface CourseAttendance {
  id: number;
  studentId: number;
  courseId: number;
  sessionId: number;
  isPresent: boolean;
}

interface ExportDataRow {
  'Student Name': string;
  'Academic Number': string;
  [key: string]: string;
}

const CourseAttendanceManagement: React.FC<{ useDummyData?: boolean }> = ({ useDummyData = false }) => {
  // Dummy Data
  const dummyProfessors: Professor[] = [
    { id: 1, name: 'Dr. Smith' },
    { id: 2, name: 'Prof. Johnson' }
  ];

  const dummyCourses: Course[] = [
    { id: 1, courseName: 'Introduction to Computer Science', professorId: 1 },
    { id: 2, courseName: 'Advanced Mathematics', professorId: 2 }
  ];

  const dummyStudents: Student[] = [
    { id: 1, academicNumber: 'A001', studentName: 'John Doe' },
    { id: 2, academicNumber: 'A002', studentName: 'Jane Smith' },
    { id: 3, academicNumber: 'A003', studentName: 'Mike Johnson' }
  ];

  const dummySessions: CourseSession[] = [
    { id: 1, courseId: 1, sessionDate: new Date('2024-02-01') },
    { id: 2, courseId: 1, sessionDate: new Date('2024-02-08') },
    { id: 3, courseId: 1, sessionDate: new Date('2024-02-15') }
  ];

  const dummyAttendanceRecords: CourseAttendance[] = [
    { id: 1, studentId: 1, courseId: 1, sessionId: 1, isPresent: true },
    { id: 2, studentId: 1, courseId: 1, sessionId: 2, isPresent: false },
    { id: 3, studentId: 2, courseId: 1, sessionId: 1, isPresent: true },
    { id: 4, studentId: 2, courseId: 1, sessionId: 2, isPresent: true }
  ];

  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<CourseAttendance[]>([]);
  
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [generatedQRCode, setGeneratedQRCode] = useState<string>('');

  // Fetch initial data
  useEffect(() => {
    if (useDummyData) {
      setProfessors(dummyProfessors);
      setCourses(dummyCourses);
      setStudents(dummyStudents);
      setSessions(dummySessions);
      setAttendanceRecords(dummyAttendanceRecords);
    } else {
      const fetchInitialData = async () => {
        try {
          const [professorsRes, coursesRes, studentsRes, sessionsRes, attendanceRes] = await Promise.all([
            fetch('/api/professors').then(res => res.json()),
            fetch('/api/courses').then(res => res.json()),
            fetch('/api/students').then(res => res.json()),
            fetch('/api/sessions').then(res => res.json()),
            fetch('/api/attendance').then(res => res.json())
          ]);

          setProfessors(professorsRes);
          setCourses(coursesRes);
          setStudents(studentsRes);
          setSessions(sessionsRes);
          setAttendanceRecords(attendanceRes);
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      };

      fetchInitialData();
    }
  }, [useDummyData]);

  // Filter sessions for the selected course
  const courseSessions = useMemo(() => {
    return selectedCourseId 
      ? sessions.filter(session => session.courseId === selectedCourseId)
      : [];
  }, [sessions, selectedCourseId]);

  // Filter students enrolled in the selected course
  const courseStudents = useMemo(() => {
    if (!selectedCourseId) return [];

    // Find students enrolled in the course
    return students.filter(student => 
      attendanceRecords.some(record => 
        record.courseId === selectedCourseId && 
        record.studentId === student.id
      )
    );
  }, [students, attendanceRecords, selectedCourseId]);

  // Check attendance for a specific student and session
  const isStudentPresentInSession = (studentId: number, sessionId: number) => {
    return attendanceRecords.some(record => 
      record.studentId === studentId && 
      record.sessionId === sessionId && 
      record.isPresent
    );
  };

  // Handle attendance toggle
  const handleAttendanceChange = async (studentId: number, sessionId: number) => {
    if (useDummyData) {
      // Simulate attendance change for dummy data
      setAttendanceRecords(records => 
        records.map(record => 
          record.studentId === studentId && record.sessionId === sessionId
            ? { ...record, isPresent: !record.isPresent }
            : record
        )
      );
      return;
    }

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId, 
          sessionId, 
          courseId: selectedCourseId,
          isPresent: !isStudentPresentInSession(studentId, sessionId)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }

      // Refresh attendance records
      const updatedAttendance = await fetch('/api/attendance').then(res => res.json());
      setAttendanceRecords(updatedAttendance);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    if (!selectedCourseId) return;

    const exportData: ExportDataRow[] = courseStudents.map(student => {
      const studentAttendance: ExportDataRow = {
        'Student Name': student.studentName,
        'Academic Number': student.academicNumber
      };

      courseSessions.forEach(session => {
        studentAttendance[`Attended ${session.sessionDate.toString().split('T')[0]}`] = 
          isStudentPresentInSession(student.id, session.id) ? 'Yes' : 'No';
      });

      return studentAttendance;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    XLSX.writeFile(workbook, `${courses.find(c => c.id === selectedCourseId)?.courseName}_Attendance.xlsx`);
  };

  // Generate QR Code for course
  const generateCourseQRCode = () => {
    if (!selectedCourseId) return;

    const qrCodeContent = `COURSE:${selectedCourseId}:${Date.now()}`;
    setGeneratedQRCode(qrCodeContent);
    setQrCodeDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8" /> Course Attendance
        </h2>
        
        <div className="flex items-center gap-4">
          <Select 
            value={selectedCourseId?.toString() || ''} 
            onValueChange={(value) => setSelectedCourseId(Number(value))}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedCourseId && (
            <>
              <Button onClick={exportToExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Export to Excel
              </Button>
              <Button onClick={generateCourseQRCode}>
                <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
              </Button>
            </>
          )}
        </div>
      </div>

      {selectedCourseId && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Academic Number</TableHead>
              {courseSessions.map(session => (
                <TableHead key={session.id}>
                  {new Date(session.sessionDate).toLocaleDateString()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseStudents.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>{student.academicNumber}</TableCell>
                {courseSessions.map(session => (
                  <TableCell key={session.id} className="text-center">
                    <Checkbox
                      checked={isStudentPresentInSession(student.id, session.id)}
                      onCheckedChange={() => handleAttendanceChange(student.id, session.id)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* QR Code Dialog */}
      <Dialog open={qrCodeDialogOpen} onOpenChange={setQrCodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Attendance QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {generatedQRCode && (
              <QRCode 
                value={generatedQRCode} 
                size={256} 
              />
            )}
            <p className="text-sm text-gray-600">
              Students can scan this QR code to mark their attendance
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseAttendanceManagement;