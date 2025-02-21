# Team Task Demo

A collaborative task management application built with modern web technologies. This app allows teams to manage tasks, track progress, and collaborate effectively.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: NeonDB (Postgres)
- **Authentication**: Clerk
- **ORM**: DrizzleORM
- **Payment Processing**: Stripe
- **Development Tools**: TypeScript, ngrok for tunneling

## Prerequisites

- Node.js 18+
- yarn or npm
- ngrok account with authtoken
- Clerk account
- NeonDB account
- Stripe account (for payments)

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd team-task-demo
```

2. Install dependencies

```bash
yarn install
# or
npm install
```

3. Set up environment variables

```bash
cp .env.sample .env.local
```

Edit `.env.local` with your credentials:

#### Clerk Authentication

- Get from [Clerk Dashboard](https://dashboard.clerk.dev):
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`

#### Database

- Get from [NeonDB Dashboard](https://console.neon.tech):
  - `DATABASE_URL`

#### Stripe

- Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys):
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Set up webhook in Stripe Dashboard to get:
  - `STRIPE_WEBHOOK_SECRET`

#### App Config

- `NEXT_PUBLIC_APP_URL`: Local development URL
- `NEXT_PUBLIC_NGROK_URL`: Your ngrok domain (e.g., your-domain.ngrok-free.app)

4. Configure ngrok

```bash
ngrok config add-authtoken your_auth_token
```

## Development

1. Initialize the database

```bash
yarn db:generate
yarn db:apply
```

2. Start the development server

```bash
yarn dev
```

This will:

- Start the Next.js development server
- Create a public ngrok URL for webhook testing
- Auto-reload on code changes

Access the app at:

- Local: http://localhost:3000
- Public URL: Your ngrok URL (shown in terminal)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
