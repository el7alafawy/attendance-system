
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      const courseAttendance = await prisma.courseAttendance.create({ 
        data: body,
        include: { 
          student: true,
          course: true,
          session: true
        }
      })
      return NextResponse.json(courseAttendance, { status: 201 })
    } catch (error) {
      return NextResponse.json({ error: 'Course attendance creation failed' }, { status: 500 })
    }
  }
  export async function GET() {
    try {
      const courseAttendance = await prisma.courseAttendance.findMany({
        include: { 
          student: true,
          course: true,
          session: true
        }
      })
      return NextResponse.json(courseAttendance)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to retrieve course attendance' }, { status: 500 })
    }
  }