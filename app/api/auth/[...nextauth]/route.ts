export const runtime = "nodejs";

import { handlers } from "@/auth/index"; // Pulls the handlers created in your main src/auth.ts

// Export the GET and POST methods exactly as Auth.js expects them
export const { GET, POST } = handlers;