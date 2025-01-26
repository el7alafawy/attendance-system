export type Student = {
    id: string;
    name: string;
  }
  
  export type Professor = {
    id: string;
    name: string;
  }
  
  export type Course = {
    id: string;
    courseName: string;
    professorId: string;
  }
  
  export type CourseEnrollment = {
    id: string;
    studentId: string;
    courseId: string;
    enrollmentDate: Date;
  }
  
  export type CourseSession = {
    id: string;
    courseId: string;
    sessionDate: Date;
    startTime: string;
    endTime: string;
    topic: string;
  }