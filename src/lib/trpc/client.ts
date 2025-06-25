import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/lib/api/root";

export const trpc = createTRPCReact<AppRouter>();
