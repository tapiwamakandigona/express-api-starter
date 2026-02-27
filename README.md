<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Express%20API%20Starter&fontSize=50&animation=fadeIn&fontAlignY=38&desc=Production-Ready%20REST%20API%20Boilerplate&descAlignY=51&descAlign=62" />
</div>

<h1 align="center">Express + TypeScript + Prisma REST API Starter</h1>

<div align="center">
  <p><strong>A production-grade REST API boilerplate with JWT authentication, input validation, Prisma ORM, comprehensive error handling, and full test coverage.</strong></p>
  
  <p>
    <img src="https://img.shields.io/github/languages/top/tapiwamakandigona/express-api-starter?style=for-the-badge&color=blue" alt="Top Language" />
    <img src="https://img.shields.io/github/last-commit/tapiwamakandigona/express-api-starter?style=for-the-badge&color=green" alt="Last Commit" />
  </p>
</div>

---

## ⚡ What's Included

This is not a tutorial project — it's a **production-ready starter** designed for immediate use in real applications.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js + Express | HTTP server |
| **Language** | TypeScript (Strict Mode) | Type safety |
| **ORM** | Prisma | Database access with migrations |
| **Auth** | JWT + bcrypt | Stateless authentication |
| **Validation** | Zod | Runtime input validation |
| **Testing** | Jest + Supertest | Unit + integration tests |
| **CI/CD** | GitHub Actions | Automated build + test |

---

## 🏗️ Architecture

```mermaid
graph TD;
    Client[HTTP Client] --> Router[Express Router];
    Router --> Middleware[Auth Middleware / JWT];
    Middleware --> Controller[Route Controllers];
    Controller --> Service[Business Logic];
    Service --> Prisma[Prisma ORM];
    Prisma --> DB[(PostgreSQL)];
    Controller --> Validator[Zod Schemas];
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/tapiwamakandigona/express-api-starter.git
cd express-api-starter
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

## 🧪 Run Tests

```bash
npm test
```

---

<div align="center">
  <b>Built by <a href="https://github.com/tapiwamakandigona">Tapiwa Makandigona</a></b>
  <br/>
  <i>⭐ Star this if you use it as a starter for your next API!</i>
</div>
