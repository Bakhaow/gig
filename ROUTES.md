# API Routes Documentation

## Authentication

- **POST /auth/register** - Register a new user
- **POST /auth/login** - Authenticate user
- **POST /auth/logout** - Logout user
- **POST /auth/forgot-password** - Request password reset
- **POST /auth/reset-password** - Reset password

## User Profile

- **GET /user/profile** - Retrieve user details
- **PUT /user/profile** - Update profile information
- **GET /user/profile/transactions** - View payment history

## Job Offers

- **GET /jobs** - List all public job offers
- **GET /jobs/:id** - View job details
- **POST /jobs** - Create a job offer
- **PUT /jobs/:id** - Edit job offer (client only)
- **DELETE /jobs/:id** - Remove job offer (client only)
- **POST /jobs/:id/apply** - Apply for a job (provider)
- **POST /jobs/:id/withdraw** - Withdraw application
- **GET /jobs/:id/confirm-provider** - Confirm provider selection
- **GET /jobs/:id/lock** - Lock job (client only)
- **GET /jobs/:id/unlock** - Unlock job (client only)
- **POST /jobs/:id/rate-provider** - Rate provider upon job completion

## Payments

- **POST /payments** - Process payment after job completion
- **GET /payments/:id** - Check payment status
- **GET /payments/transaction-history** - List user transactions

## Chat & Communication

- **GET /chat/:job_id** - Open chat for a job
- **POST /chat/:job_id** - Send a message

## Admin (If Applicable)

- **GET /admin/jobs** - View all job offers
- **GET /admin/users** - Manage users
- **GET /admin/payments** - Oversee transactions
- **GET /admin/reports** - Monitor disputes/flags

## Disputes

- **POST /disputes/:job_id** - Open a dispute
- **GET /disputes/:job_id** - View dispute details
- **PUT /disputes/:job_id** - Resolve or update dispute

## Settings & Miscellaneous

- **GET /settings** - View platform settings
- **PUT /settings** - Modify settings (admin only)
- **GET /categories** - Fetch job categories
- **GET /job-statuses** - Retrieve job statuses
