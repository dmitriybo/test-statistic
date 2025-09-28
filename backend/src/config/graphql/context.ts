import jwt from 'jsonwebtoken'

export const context = ({ req }: any) => {
  const token = req.cookies?.['access_token']
  let user = null

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || '')
    } catch (e) {
      // invalid token
    }
  }

  return { user }
}
