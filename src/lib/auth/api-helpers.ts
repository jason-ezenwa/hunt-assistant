import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from './index';

export async function getSessionUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth.api.getSession({ headers: req.headers as any });

  if (!session || !session.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }

  return session.user;
}
