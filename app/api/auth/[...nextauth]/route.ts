import { GET, POST } from "@/auth";

// Force Node.js runtime for this route
export const runtime = "nodejs";

// Log when the auth API route is initialized
console.log("Auth API route initialized with Node.js runtime");

export { GET, POST };
