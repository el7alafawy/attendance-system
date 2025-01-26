import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const courseEnrollment = await prisma.courseEnrollment.create({ 
      data: body,
      include: { 
        student: true,
        course: true 
      }
    })
    return NextResponse.json(courseEnrollment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Course enrollment creation failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const courseEnrollments = await prisma.courseEnrollment.findMany({
      include: { 
        student: true,
        course: true 
      }
    })
    return NextResponse.json(courseEnrollments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve course enrollments' }, { status: 500 })
  }
}