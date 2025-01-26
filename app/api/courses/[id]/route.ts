import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await prisma.course.findUnique({ 
      where: { id: parseInt(params.id) },
      include: { 
        professor: true,
        sessions: true,
        enrollments: true,
        attendance: true
      }
    })
    return course ? NextResponse.json(course) : NextResponse.json({ error: 'Course not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve course' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const course = await prisma.course.update({ 
      where: { id: parseInt(params.id) }, 
      data: body,
      include: { professor: true }
    })
    return NextResponse.json(course)
  } catch (error) {
    return NextResponse.json({ error: 'Course update failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.course.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Course deletion failed' }, { status: 500 })
  }
}