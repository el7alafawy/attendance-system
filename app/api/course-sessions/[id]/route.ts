import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const courseSession = await prisma.courseSession.findUnique({ 
        where: { id: parseInt(params.id) },
        include: { 
          course: true,
          attendance: true
        }
      })
      return courseSession ? NextResponse.json(courseSession) : NextResponse.json({ error: 'Course session not found' }, { status: 404 })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to retrieve course session' }, { status: 500 })
    }
  }
  
  export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await request.json()
      const courseSession = await prisma.courseSession.update({ 
        where: { id: parseInt(params.id) }, 
        data: body,
        include: { course: true }
      })
      return NextResponse.json(courseSession)
    } catch (error) {
      return NextResponse.json({ error: 'Course session update failed' }, { status: 500 })
    }
  }
  
  export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      await prisma.courseSession.delete({ where: { id: parseInt(params.id) } })
      return NextResponse.json({ message: 'Course session deleted successfully' })
    } catch (error) {
      return NextResponse.json({ error: 'Course session deletion failed' }, { status: 500 })
    }
  }