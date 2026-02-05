# PT Maju Jaya - Internal Approval System

A modern web-based approval system replacing WhatsApp and email workflows for PT Maju Jaya Manufaktur. Built with React, TypeScript, Node.js, and Prisma.

---

## 🛠 Tech Stack

### Frontend

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library (built on Radix UI)
- **React Router** - Client-side routing
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM 5.x** - Database toolkit
- **PostgreSQL** - Database (via Prisma PostgreSQL adapter)
- **TypeScript** - Type safety

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Prisma's hosted option)

### Installation & Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd project
```

2. **Setup Backend**

```bash
cd server
npm install

# Create .env file with database connection
echo "DATABASE_URL=postgresql://user:password@localhost:5432/pt_maju_jaya" > .env

# Run database migrations
npx prisma migrate dev

# Seed the database with historical data
npx prisma db seed
```

3. **Setup Frontend**

```bash
cd ../client
npm install
```

4. **Start Development Servers**

Terminal 1 (Backend):

```bash
cd server
npm run dev
# Server runs on http://localhost:3000
```

Terminal 2 (Frontend):

```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

5. **Access the Application**

Open browser to `http://localhost:5173`

---

## 🎨 Decisions

### 1. **Authentication Strategy**

- **Decision**: Simple email-only authentication
- **Rationale**: Client needs "something that works" without complexity. No passwords needed for internal tool with 25 employees.
- **Future**: Can add proper authentication (OAuth, SSO) later

### 2. **Approval Workflow**

- **Decision**: Manager-based approval using existing reporting hierarchy
- **Rationale**: Client data already includes manager relationships (`managerId` in employees.json)
- **Implementation**:
  - Request automatically routes to employee's direct manager
  - Manager sees team requests in "Need Approval" tab
  - Single-level approval (for now)

### 3. **Dual Tab Interface**

- **Decision**: "All Requests" vs "Need Approval" tabs
- **Rationale**:
  - Employees need to see their own requests
  - Managers need dedicated view of pending approvals
  - Avoids confusion of mixing submitted vs received requests
- **Benefit**: Clear separation of concerns

### 4. **Data Integrity & Seeding Strategy**

- **Decision**: Robust "Two-Pass" Seeding & Auto-Correction
- **Rationale**: The raw data contained circular references (`emp-010` ↔ `emp-011`) and missing references (e.g., `dept-008` was missing from departments).
- **Implementation**:
  1. **Auto-Correction**: Detected missing departments (Marketing) during seeding and generated placeholder records to prevent foreign key violations.
  2. **Two-Pass Employee Creation**:
     - Pass 1: Create employees with `managerId: null`.
     - Pass 2: Connect managers after all employees exist.
- **Result**: Successfully imported 100% of the imperfect historical data without manual JSON editing.

---

## 🤖 AI Tools Usage

### Tools Used

**Primary Tool: GitHub Copilot + Claude**

- **Code Generation**: Component scaffolding, boilerplate reduction
- **Type Definitions**: Helped define comprehensive TypeScript interfaces
- **Refactoring**: Identified duplication and suggested extractions
- **Error Fixing**: TypeScript type errors, import issues
- **Documentation**: README structure and content

### Where AI Was Most Helpful

1. **UI Design & Component Structure**:
   - Modern, professional interface layout and styling
   - shadcn/ui component integration and customization
   - Responsive design patterns with Tailwind CSS

2. **Type Safety**:
   - Converting implicit `any` to proper types
   - Type-only imports for `verbatimModuleSyntax`
   - Union types for request details

3. **Component Refactoring**:
   - Identifying duplicate code patterns
   - Extracting reusable components
   - Creating custom hooks

4. **Error Handling**:
   - Fixing circular reference issues in seed data
   - Proper TypeScript error handling patterns

### Where AI Was Less Helpful

1. **Business Logic Decisions**:
   - Approval workflow design
   - Tab interface UX decisions
   - Seed data strategy for circular references
     → **Required human judgment based on client needs**

2. **Architecture Decisions**:
   - When to refactor vs continue building
   - Component granularity
   - State management approach
     → **Needed to evaluate project scope and future needs**

3. **Client Requirements Interpretation**:
   - What constitutes "nice to have history"
   - How detailed should request tracking be
   - UI/UX preferences
     → **Required reading between the lines of sparse client specs**
