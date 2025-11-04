import { authClient } from "../auth/auth-client";

export function useSession() {
  return authClient.useSession();
}

export async function getSession() {
  return authClient.getSession();
}
