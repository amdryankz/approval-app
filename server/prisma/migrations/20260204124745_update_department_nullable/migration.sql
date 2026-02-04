-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_department_id_fkey";

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "department_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
