# Portfolio Management Dashboard

A portfolio management dashboard for tracking investments (stocks, bonds, mutual funds), viewing transaction history, and adding/editting holdings.

---

## Requirements

1. **User Authentication**
   - JWT-based login/logout (access token)
2. **Portfolio Overview**
   - Dashboard shows user investment portfolios.
   - Display summary of assets, such as stocks, bonds, and mutual funds, including their current value, purchase price, and perfomance metrics.
3. **Transaction History**
   - Paginated list of buy/sell transactions
4. **Add/Edit Investments**
   - Create holdings, edit quantity, record buy/sell
5. **Tech Stack**

- **Frontend** Vite, React, TypeScript, React Query, React Router? Tanstack Router?, Zustand
- **Backend** Node.js, TypeScript, Express, Prisma ORM
- **Database** PostgreSQL

## Installing

**Running Prisma studio**

```json
   npx prisma studio
```

docker compose --env-file ./backend/.env.development up --build
