import { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'

const USER_COOKIE = 'mafia_user_id'

export function userIdentity(req: Request, res: Response, next: NextFunction) {
  let userId = req.cookies?.[USER_COOKIE]
  if (!userId) {
    userId = randomUUID()
    res.cookie(USER_COOKIE, userId, {
      httpOnly: true,
      // In production the frontend (Netlify) and backend (Render) are cross-site,
      // so the auth cookie must be SameSite=None + Secure to be sent on fetch/XHR.
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })
  }
  console.log('userID', userId)

  // Attach to request (typed-safe access)
  ;(req as any).userId = userId
  next()
}
