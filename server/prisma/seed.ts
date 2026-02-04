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
    const deptExist = await prisma.department.findUnique({
      where: {
        id: emp.department_id
      }
    })

    if (!deptExist) {
      await prisma.department.create({
        data: {
          id: emp.department_id,
          name: emp.role.split(" ")[0],
          location: "Jakarta HQ"
        }
      })
    }

    await prisma.employee.create({
      data: {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        departmentId: emp.department_id,
        managerId: null,
        status: emp.status,
        joinDate: new Date(emp.join_date),
        endDate: emp.end_date ? new Date(emp.end_date) : null,
      },
    })
  }
  console.log(`Created ${employeesData.length} employees`)

  console.log('Updating employee manager relationships...')
  for (const emp of employeesData) {
    if (emp.manager_id) {
      const empExist = await prisma.employee.findUnique({
        where: {
          id: emp.manager_id
        }
      })

      if (!empExist) {
        emp.manager_id = null
      }

      await prisma.employee.update({
        where: { id: emp.id },
        data: { managerId: emp.manager_id },
      })
    }
  }
  console.log(`Updated manager relationships`)

  console.log('Seeding requests...')
  for (const req of requestsData) {
    await prisma.request.create({
      data: {
        id: req.id,
        type: req.type,
        submittedBy: req.submitted_by,
        submittedAt: parseDate(req.submitted_at)!,
        status: req.status,
        approvedBy: req.approved_by || null,
        approvedAt: req.approved_at ? parseDate(req.approved_at) : null,
        details: req.details,
        notes: req.notes,
      },
    })
  }
  console.log(`Created ${requestsData.length} requests`)

  console.log(`Seeding finished.`)
}

function parseDate(date: string) {
  if (!date) return null;

  if (/^\d{2}\/\d{2}\/\d{4}/.test(date)) {
    const [datePart, timePart] = date.split(' ');
    const [day, month, year] = datePart.split('/');

    return new Date(`${year}-${month}-${day}T${timePart || '00:00:00'}`);
  }

  return new Date(date);
};

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
