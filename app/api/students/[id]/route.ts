import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()


export async function GET(
    request: NextRequest, 
    { params }: { params: { id: string } }
  ) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: parseInt(params.id) },
        include: {
          enrollments: true,
          attendance: true
        }
      })
      return student 
        ? NextResponse.json(student)
        : NextResponse.json({ error: 'Student not found' }, { status: 404 })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 })
    }
  }
  
  export async function PUT(
    request: NextRequest, 
    { params }: { params: { id: string } }
  ) {
    try {
      const studentData = await request.json()
      const updatedStudent = await prisma.student.update({
        where: { id: parseInt(params.id) },
        data: studentData
      })
      return NextResponse.json(updatedStudent)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
    }
  }
  
  export async function DELETE(
    request: NextRequest, 
    { params }: { params: { id: string } }
  ) {
    try {
      await prisma.student.delete({
        where: { id: parseInt(params.id) }
      })
      return NextResponse.json({ message: 'Student deleted successfully' })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
    }
  }