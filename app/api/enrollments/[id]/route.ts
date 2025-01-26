import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseEnrollment = await prisma.courseEnrollment.findUnique({ 
      where: { id: parseInt(params.id) },
      include: { 
        student: true,
        course: true 
      }
    })
    return courseEnrollment ? NextResponse.json(courseEnrollment) : NextResponse.json({ error: 'Course enrollment not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve course enrollment' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const courseEnrollment = await prisma.courseEnrollment.update({ 
      where: { id: parseInt(params.id) }, 
      data: body,
      include: { 
        student: true,
        course: true 
      }
    })
    return NextResponse.json(courseEnrollment)
  } catch (error) {
    return NextResponse.json({ error: 'Course enrollment update failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.courseEnrollment.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ message: 'Course enrollment deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Course enrollment deletion failed' }, { status: 500 })
  }
}