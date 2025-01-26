import React, { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QrCode, Plus, Edit, Trash2 } from 'lucide-react'
import QRCode from 'react-qr-code'
import { Label } from '@/components/ui/label'

export default function CourseDashboard({ useDummyData = false }) {
  const [courses, setCourses] = useState<any>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [courseForm, setCourseForm] = useState({
    courseName: '',
    professorId: ''
  })
  const [enrollments, setEnrollments] = useState<any>([])
  const [courseSessions, setCourseSessions] = useState<any>([])
  const [activeTab, setActiveTab] = useState('courses')
  const [professors, setProfessors] = useState<any>([])

  // Dummy data
  const dummyProfessors = [
    { id: 1, name: 'Dr. Smith' },
    { id: 2, name: 'Prof. Johnson' },
    { id: 3, name: 'Dr. Williams' }
  ]

  const dummyCourses = [
    { id: 1, courseName: 'Introduction to Computer Science', professorId: 1 },
    { id: 2, courseName: 'Advanced Mathematics', professorId: 2 },
    { id: 3, courseName: 'Data Structures', professorId: 3 }
  ]

  const dummyCourseSessions = [
    { 
      id: 1, 
      course: { courseName: 'Introduction to Computer Science' }, 
      sessionDate: new Date('2024-02-01') 
    },
    { 
      id: 2, 
      course: { courseName: 'Advanced Mathematics' }, 
      sessionDate: new Date('2024-02-15') 
    }
  ]

  useEffect(() => {
    if (useDummyData) {
      setProfessors(dummyProfessors)
      setCourses(dummyCourses)
      setCourseSessions(dummyCourseSessions)
    } else {
      const fetchProfessors = async () => {
        try {
          const response = await fetch('/api/professors')
          const data = await response.json()
          setProfessors(data)
        } catch (error) {
          console.error('Failed to fetch professors', error)
        }
      }
      fetchProfessors()
    }
  }, [useDummyData])

  // Fetch initial data
  useEffect(() => {
    if (!useDummyData) {
      fetchCourses()
    }
  }, [useDummyData])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Failed to fetch courses', error)
    }
  }

  const handleCreateCourse = async (e:any) => {
    e.preventDefault()
    
    if (useDummyData) {
      // Simulate course creation for dummy data
      const newCourse = {
        id: courses.length + 1,
        courseName: courseForm.courseName,
        professorId: parseInt(courseForm.professorId)
      }
      setCourses([...courses, newCourse])
      setCourseForm({ courseName: '', professorId: '' })
      return
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...courseForm,professorId:parseInt(courseForm.professorId)})
      })
      const newCourse = await response.json()
      setCourses([...courses, newCourse])
      setCourseForm({ courseName: '', professorId: '' })
    } catch (error) {
      console.error('Course creation failed', error)
    }
  }

  const handleDeleteCourse = async (courseId:any) => {
    if (useDummyData) {
      // Simulate course deletion for dummy data
      setCourses(courses.filter((course:any) => course.id !== courseId))
      return
    }

    try {
      await fetch(`/api/courses/${courseId}`, { method: 'DELETE' })
      setCourses(courses.filter((course:any) => course.id !== courseId))
    } catch (error) {
      console.error('Course deletion failed', error)
    }
  }

  const generateSessionQR = (sessionId:any) => {
    // Encrypt session ID (basic example)
    const encryptedId = btoa(sessionId.toString())
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <QrCode className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session QR Code</DialogTitle>
          </DialogHeader>
          <QRCode value={encryptedId} />
        </DialogContent>
      </Dialog>
    )
  }

  const renderCoursesTab = () => (
    <div>
      <form onSubmit={handleCreateCourse} className="mb-4 flex gap-2">
        <Input
          placeholder="Course Name"
          value={courseForm.courseName}
          onChange={(e) => setCourseForm({...courseForm, courseName: e.target.value})}
        />
        <Select
          onValueChange={(value) => setCourseForm({...courseForm, professorId: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Professor" />
          </SelectTrigger>
          <SelectContent>
            {professors.map((professor:any) => (
              <SelectItem key={professor.id} value={professor.id.toString()}>
                {professor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit"><Plus className="mr-2" /> Create Course</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Professor ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course:any) => (
            <TableRow key={course.id}>
              <TableCell>{course.courseName}</TableCell>
              <TableCell>{course.professorId}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const renderCourseSessions = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Session QR</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courseSessions.map((session:any) => (
          <TableRow key={session.id}>
            <TableCell>{session.course.courseName}</TableCell>
            <TableCell>{new Date(session.sessionDate).toLocaleDateString()}</TableCell>
            <TableCell>
              {generateSessionQR(session.id)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="p-6">
      <div className="flex mb-4 gap-2">
        <Button 
          variant={activeTab === 'courses' ? 'default' : 'outline'}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </Button>
        <Button 
          variant={activeTab === 'sessions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('sessions')}
        >
          Course Sessions
        </Button>
      </div>

      {activeTab === 'courses' ? renderCoursesTab() : renderCourseSessions()}
    </div>
  )
}