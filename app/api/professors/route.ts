import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    try {
      const professors = await prisma.professor.findMany({
        include: { courses: true }
      })
      return NextResponse.json(professors)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch professors' }, { status: 500 })
    }
  }
  
  export async function POST(request: NextRequest) {
    try {
      const professorData = await request.json()
      const newProfessor = await prisma.professor.create({ data: professorData })
      return NextResponse.json(newProfessor, { status: 201 })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create professor' }, { status: 500 })
    }
  }
  