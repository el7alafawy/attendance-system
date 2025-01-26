import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
    request: NextRequest, 
    { params }: { params: { id: string } }
  ) {
    try {
      const professor = await prisma.professor.findUnique({
        where: { id: parseInt(params.id) },
        include: { courses: true }
      })
      return professor 
        ? NextResponse.json(professor)
        : NextResponse.json({ error: 'Professor not found' }, { status: 404 })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch professor' }, { status: 500 })
    }
  }
  
  export async function PUT(
    request: NextRequest, 
    { params }: { params: { id: string } }
  ) {
    try {
      const professorData = await request.json()
      const updatedProfessor = await prisma.professor.update({
        where: { id: parseInt(params.id) },
        data: professorData
      })
      return NextResponse.json(updatedProfessor)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update professor' }, { status: 500 })
    }
  }
  
  export async function DELETE(
    request: NextRequest, 
    { params }: { params: { id: string } }
  ) {
    try {
      await prisma.professor.delete({
        where: { id: parseInt(params.id) }
      })
      return NextResponse.json({ message: 'Professor deleted successfully' })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete professor' }, { status: 500 })
    }
  }