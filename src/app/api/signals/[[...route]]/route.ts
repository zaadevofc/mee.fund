import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { handle } from 'hono/vercel';
import { compareArrays, exclude, verifyJWT } from '~/libs/tools';
import prisma from '~/prisma';

const app = new Hono<{ Variables: any }>().basePath('/api/signals')
const baseUrl = (c: any) => c.req.raw.nextUrl.origin + '/';

app.use(prettyJSON({ space: 2 }))
app.use(csrf({ origin: ['mee.fund'], }))
app.use('*', secureHeaders({ xFrameOptions: true, xXssProtection: true, }))

app.use('*', async (c, next) => {
  const queries = c.req.query()

  c.set('base_url', baseUrl(c))
  c.set('queries', Object.keys(queries))
  c.set('validate', (keys: string[]) => compareArrays(c.get('payloads'), keys))

  if (!queries.token) return c.json({ error: 'TOKEN_REQUIRED' }, 403)

  const isTokenValid = await verifyJWT(queries.token);
  if (!isTokenValid) return c.json({ error: 'TOKEN_INVALID' }, 403)

  c.set('payload', isTokenValid)
  c.set('payloads', Object.keys(isTokenValid))

  return next()
})

app.get('/user/profile', async (c) => {
  if (!c.get('validate')(['username'])) return c.json({ error: 'INVALID_QUERY' }, 400)
  
  try {
    const user = await prisma.user.findUnique({
      where: { username: c.get('payload')['username'] },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            post_likes: true,
            bookmarks: true,
          }
        }
      },
    })

    if (user) return c.json({ data: exclude(user, ['email']) })
    return c.json({ error: 'NOT_FOUND' }, 404)
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error)
    return c.json({ error: 'INTERNAL_SERVER_ERROR' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)