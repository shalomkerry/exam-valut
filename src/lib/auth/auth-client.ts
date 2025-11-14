// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Use same-origin by default in the browser so deployments work without hardcoding localhost.
  // If you need to point to a different server, set an explicit BASE_URL and update here.
  basePath: "/api/auth",
});

