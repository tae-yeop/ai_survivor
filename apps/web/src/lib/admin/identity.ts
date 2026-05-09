import type { AdminSessionPayload } from "./session-token.ts";

export type AdminIdentity =
  | { admin: false }
  | {
      admin: true;
      login: string;
    };

export function adminIdentityFromSession(session: AdminSessionPayload | null): AdminIdentity {
  if (!session) return { admin: false };
  return { admin: true, login: session.login };
}
