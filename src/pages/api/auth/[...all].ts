import { auth } from '@/lib/auth';

export default async function handler(req: any) {
  return auth.handler(req);
}
