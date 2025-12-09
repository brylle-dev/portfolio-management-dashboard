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

## Running via Docker

```json
   docker compose --env-file ./.env.development up --build
```

**(This will also seed the database. populating initial data)**

**Frontend App**

```
http://localhost:8080
```

**Backend**

```
http://localhost:3000

```

**Prisma Studio**

- This an app for database visualization

```
http://localhost:5555

```

User login

```json
{
  "identifier": "investor@example.com",
  "password": "Str0ngP@ss!"
}
```

### API Contract

**AUTH**

- Login: **POST** `/api/v1/auth/login`

```json
{
  "identifier": "investor@example.com",
  "password": "Str0ngP@ss!"
}
```

```json
   curl --location 'http://localhost:3000/api/v1/auth/login' \
   --header 'Content-Type: application/json' \
   --header 'Cookie: refresh_token=5d114f21d83439ec4d1391fceb26c407d0542dc15acc43323e1e8be83f5d922e' \
   --data-raw '{
      "identifier": "investor@example.com",
      "password": "Str0ngP@ss!"
   }
   '
```

- Register: **POST** `/api/v1/auth/register`

```json
curl --location 'http://localhost:3000/api/v1/auth/register' \
--header 'Content-Type: application/json' \
--header 'Cookie: refresh_token=5d114f21d83439ec4d1391fceb26c407d0542dc15acc43323e1e8be83f5d922e' \
--data-raw '{
    "email": "test@gmail.com",
    "password": "p@ssw0rd",
    "confirmPassword": "p@ssw0rd",
    "fullName": "Test User"
}'

```

**Portfolio**

- List: **GET** `api/v1/portfolio`
- List all portfolio

```json
   curl --location 'http://localhost:3000/api/v1/portfolio/' \
--header 'Authorization: Bearer <token>'
```

- Create: **POST** `api/v1/portfolio`
  - Create new portfolio

```json
   curl --location 'http://localhost:3000/api/v1/portfolio/' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Test Portfolio",
    "baseCurrency": "Php"
}'

```

- Overview **GET** `/api/v1/portfolio/{{portfolioId}}/overview`
  - View specific portfolio

```json
   curl --location 'http://localhost:3000/api/v1/portfolio/cmiwwhhbh0008osvcvnyujgb7/overview' \
--header 'Authorization: Bearer <token>'
```

**Transaction**

- List: **GET** `/api/v1/transaction/<portfolioId>`

```json
curl --location 'http://localhost:3000/api/v1/transaction/cmiwwhhbh0008osvcvnyujgb7' \
--header 'Authorization: Bearer <token>'

```

- Create **POST** `/api/v1/transaction`

```json
   curl --location 'http://localhost:3000/api/v1/transaction' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "portfolioId": "cmiwwhhbh0008osvcvnyujgb7",
    "instrumentId": "cmiwwhh4z0002osvc07zmmpv9",
    "txnType": "buy",
    "quantity": "25",
    "unitPrice": "150",
    "fees": "5.0",
    "tradeDate": "2025-12-06T00:00:00.000Z",
    "settlementDate": "2025-12-08T00:00:00.000Z",
    "notes": "Test Trade"
}'

```
