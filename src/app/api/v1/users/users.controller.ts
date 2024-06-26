import { Hono } from "hono";
import { exclude } from "~/libs/tools";
import { getManyUsers, getUserProfile } from "./users.service";
import { MakeError } from "../[[...route]]/route";

const app = new Hono<{ Variables: any }>()

app.get('/profile', async (c) => {
  try {
    const check = c.get('validate')(['username | request_id'])
    if (check) return check;

    const { username, request_id } = c.get('payload')
    const profile = await getUserProfile({ username, request_id })

    if (!profile) MakeError(404, 'NOT_FOUND', 'User tidak ditemukan.')
    return c.json({ data: exclude(profile, ['email']) })

  } catch (error: any) {
    console.log("🚀 ~ app.get ~ error:", error)
    return c.get('ParseError')(error)
  }
})

app.get('/suggestions', async (c) => {
  try {
    const check = c.get('validate')(['limit', 'offset'])
    if (check) return check;

    const { limit, offset } = c.get('payload')
    const suggests = await getManyUsers({
      limit, offset, options: {
        select:{ username: true, name: true, bio: true, picture: true, is_verified: true },
        where: { visibility: 'PUBLIC', is_blocked: false },
        orderBy: { followers: { _count: 'desc' } }
      }
    })

    return c.json({ data: suggests })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})
export { app as UserController };
