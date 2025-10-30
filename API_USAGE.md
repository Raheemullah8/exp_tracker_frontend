# Frontend -> Backend API helpers (auto-generated)

I added a small `src/api` helper that centralizes Axios usage and exposes service functions
you can import from your components.

Files added:
- `src/api/axiosConfig.js` - axios instance (baseURL from `VITE_API_URL` or `http://localhost:5000`, uses cookies)
- `src/api/auth.js` - signup / login / logout / getUser
- `src/api/income.js` - add/get/delete/download income
- `src/api/expense.js` - add/get/delete/download expense
- `src/api/dashboard.js` - get dashboard data
- `src/api/index.js` - re-exports the above as `Auth`, `Income`, `Expense`, `Dashboard`

Usage example (in a React component):

```js
import { Auth, Income, Expense, Dashboard } from './api';

// login
const doLogin = async () => {
  try {
    const data = await Auth.login({ email: 'a@b.com', password: 'secret' });
    console.log('logged in', data);
  } catch (err) {
    console.error('login error', err);
  }
};

// fetch incomes
const loadIncomes = async () => {
  try {
    const list = await Income.getIncomes();
    console.log(list);
  } catch (err) {
    console.error(err);
  }
};
```

Environment:
- To point the frontend at your API server, create a `.env` or `.env.local` with:

```
VITE_API_URL=http://localhost:5000
```

Notes / assumptions:
 - I updated the helpers to match the routes you shared:
   - Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/users` (GET), `/api/auth/logout`
   - Income: `/api/income/add` (POST), `/api/income/get` (GET), `/api/income/:id` (DELETE), `/api/income/download` (GET)
   - Expense: `/api/expense/add` (POST), `/api/expense/get` (GET), `/api/expense/:id` (DELETE), `/api/expense/download` (GET)
   - Dashboard: `/api/dashboard` (GET)
If anything still differs, tell me which route names to use and I'll update the service functions.
