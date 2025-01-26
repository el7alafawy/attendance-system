import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    try {
      const students = await prisma.student.findMany({
        include: {
          enrollments: true,
          attendance: true
        }
      })
      return NextResponse.json(students)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
    }
  }
  
  export async function POST(request: NextRequest) {
    try {
      const studentData = await request.json()
      const newStudent = await prisma.student.create({ data: studentData })
      return NextResponse.json(newStudent, { status: 201 })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
    }
  }