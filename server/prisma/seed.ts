import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as fs from 'fs'
import * as path from 'path'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

async function main() {
  console.log(`Start seeding ...`)

  await prisma.request.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.department.deleteMany()

  const departmentsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'departments.json'), 'utf-8')
  )
  const employeesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'employees.json'), 'utf-8')
  )
  const requestsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'requests.json'), 'utf-8')
  )

  console.log('Seeding departments...')
  for (const dept of departmentsData) {
    await prisma.department.create({
      data: {
        id: dept.id,
        name: dept.name,
        location: dept.location,
      },
    })
  }
  console.log(`Created ${departmentsData.length} departments`)

  console.log('Seeding employees...')
  for (const emp of employeesData) {
    await prisma.employee.create({
      data: {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        departmentId: emp.department_id,
        managerId: emp.manager_id,
        status: emp.status,
        joinDate: new Date(emp.join_date),
        endDate: emp.end_date ? new Date(emp.end_date) : null,
      },
    })
  }
  console.log(`Created ${employeesData.length} employees`)

  console.log('Seeding requests...')
  for (const req of requestsData) {
    await prisma.request.create({
      data: {
        id: req.id,
        type: req.type,
        submittedBy: req.submitted_by,
        submittedAt: new Date(req.submitted_at),
        status: req.status,
        approvedBy: req.approved_by || null,
        approvedAt: req.approved_at ? new Date(req.approved_at) : null,
        details: req.details,
        notes: req.notes,
      },
    })
  }
  console.log(`Created ${requestsData.length} requests`)

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
