import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const course = await prisma.course.create({ 
      data: body,
      include: { professor: true }
    })
    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Course creation failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: { 
        professor: true,
        sessions: true,
        enrollments: true 
      }
    })
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve courses' }, { status: 500 })
  }
}
