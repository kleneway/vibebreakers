#!/usr/bin/env bash

set -e

APP_NAME="newco"

echo "🚀 Starting setup..."

# Remove any existing app directory
rm -rf $APP_NAME

# 1. Create Next.js TypeScript app with Tailwind, src directory, app router, and no ESLint
echo "🛠 Creating Next.js app..."
npx create-next-app@latest $APP_NAME --ts --tailwind --src-dir --app --no-eslint --use-npm

cd $APP_NAME

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install zod @tanstack/react-query @shadcn/ui prisma @prisma/client @next-auth/prisma-adapter next-auth resend @aws-sdk/client-s3 inngest @supabase/supabase-js

# Prisma init
echo "🗄 Initializing Prisma..."
npx prisma init

# Overwrite Prisma schema to support NextAuth
cat > prisma/schema.prisma <<EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id             String    @id @default(cuid())
  name           String?
  email          String?   @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
}

model Account {
  id                String @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
EOF

# 3. Setup shadcn/ui
echo "🎨 Setting up shadcn/ui..."
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input

# Ensure globals.css for Tailwind
cat > src/app/globals.css <<EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 4. Create directory structure and files
echo "📂 Creating directory structure..."

mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/api/upload
mkdir -p src/app/api/inngest
mkdir -p src/app/dashboard
mkdir -p src/components/ui
mkdir -p src/components/ClientProvider
mkdir -p src/lib/email/templates
mkdir -p src/lib/zod
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p prisma/migrations

# App layout (Server Component)
cat > src/app/layout.tsx <<EOF
import "./globals.css";
import React from "react";

export const metadata = {
  title: "$APP_NAME",
  description: "A Next.js Starter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# ClientProvider Component (Client Component)
cat > src/components/ClientProvider/index.tsx <<EOF
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
EOF

# Main page
cat > src/app/page.tsx <<EOF
import React from "react";
import ClientProvider from "@/components/ClientProvider";

export default function Page() {
  return (
    <ClientProvider>
      <div className="p-4">
        <h1 className="text-xl font-bold">Welcome to $APP_NAME</h1>
        <p>Next.js + NextAuth + Prisma + and more...</p>
      </div>
    </ClientProvider>
  );
}
EOF

# Prisma db client
cat > src/lib/db.ts <<EOF
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
EOF

# NextAuth route and config
mkdir -p src/lib/auth
cat > src/app/api/auth/[...nextauth]/route.ts <<EOF
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
export const { GET, POST } = NextAuth(authOptions)
EOF

cat > src/lib/auth/index.ts <<EOF
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user = user
      }
      return session
    },
  },
}
EOF

# Zod schema
cat > src/lib/zod/userSchemas.ts <<EOF
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
EOF

# AWS S3 storage
cat > src/lib/storage.ts <<EOF
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(key: string, body: Buffer | Uint8Array | Blob | string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: body
  }));
  return \`https://\${process.env.S3_BUCKET}.s3.amazonaws.com/\${key}\`;
}
EOF

# Upload route
cat > src/app/api/upload/route.ts <<EOF
import { NextResponse } from 'next/server'
import { uploadFile } from '@/lib/storage'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const url = await uploadFile(file.name, buffer)
  return NextResponse.json({ url })
}
EOF

# Inngest setup
cat > inngest.config.ts <<EOF
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "$APP_NAME" });
EOF

cat > src/lib/inngest.ts <<EOF
import { inngest } from "../../inngest.config";

export const userRegistered = inngest.createFunction(
  { name: "User Registered", id: "user/registered" },
  { event: "user/registered" },
  async ({ event, step }) => {
    // Handle the event
  },
);
EOF

cat > src/app/api/inngest/handler.ts <<EOF
import { serve } from "inngest/next";
import { inngest } from "@/../inngest.config";

const sendFn = inngest.createFunction(
  { name: "inngest/send", id: "inngest/send" },
  { event: "inngest/send" },
  async ({ event }) => {
    console.log("inngest/send", event);
  },
);

export const { POST, GET } = serve({
  client: inngest,
  functions: [sendFn],
});
EOF

# Resend email setup
cat > src/lib/email/sendEmail.ts <<EOF
import { Resend } from "resend";
import { createElement } from "react";
import { WelcomeEmail } from "./templates/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
    to,
    subject: "Welcome!",
    react: createElement(WelcomeEmail, { name }),
  });
}
EOF

cat > src/lib/email/templates/WelcomeEmail.tsx <<EOF
import React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Thanks for joining us!</p>
    </div>
  );
}
EOF

# Example React Query hook
cat > src/hooks/useQueryHooks.ts <<EOF
import { useQuery } from "@tanstack/react-query";

export function useExampleQuery() {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      return { data: "Hello from React Query" };
    },
  });
}
EOF

echo "⚠️ Note: Prisma migrate requires DATABASE_URL and NextAuth requires EMAIL settings. Set these in a .env file."
echo "Example .env:"
echo "DATABASE_URL='postgresql://...'"
echo "DIRECT_URL='postgresql://...'"
echo "RESEND_API_KEY='...'"
echo "EMAIL_SERVER='...' # SMTP info"
echo "EMAIL_FROM='no-reply@yourdomain.com'"
echo "AWS_ACCESS_KEY_ID='...'"
echo "AWS_SECRET_ACCESS_KEY='...'"
echo "AWS_REGION='...'"
echo "S3_BUCKET='...'"
echo
echo "Then run: npx prisma generate"
echo "Then run: npx prisma migrate dev"
echo "Start dev server: npm run dev"
echo "✅ Setup Complete!"
