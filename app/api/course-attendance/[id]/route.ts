import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function GET(request: NextRequest, { params }: { params: any }) {
    try {
      const courseAttendance = await prisma.courseAttendance.findUnique({ 
        where: { id: parseInt(params.id) },
        include: { 
          student: true,
          course: true,
          session: true
        }
      })
      return courseAttendance ? NextResponse.json(courseAttendance) : NextResponse.json({ error: 'Course attendance not found' }, { status: 404 })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to retrieve course attendance' }, { status: 500 })
    }
  }
  
  export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await request.json()
      const courseAttendance = await prisma.courseAttendance.update({ 
        where: { id: parseInt(params.id) }, 
        data: body,
        include: { 
          student: true,
          course: true,
          session: true
        }
      })
      return NextResponse.json(courseAttendance)
    } catch (error) {
      return NextResponse.json({ error: 'Course attendance update failed' }, { status: 500 })
    }
  }
  
  export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      await prisma.courseAttendance.delete({ where: { id: parseInt(params.id) } })
      return NextResponse.json({ message: 'Course attendance deleted successfully' })
    } catch (error) {
      return NextResponse.json({ error: 'Course attendance deletion failed' }, { status: 500 })
    }
  }
  
