import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const courseSession = await prisma.courseSession.create({ 
      data: body,
      include: { course: true }
    })
    return NextResponse.json(courseSession, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Course session creation failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const courseSessions = await prisma.courseSession.findMany({
      include: { 
        course: true,
        attendance: true 
      }
    })
    return NextResponse.json(courseSessions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve course sessions' }, { status: 500 })
  }
}
