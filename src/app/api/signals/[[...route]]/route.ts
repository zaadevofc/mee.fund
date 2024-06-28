import { Prisma } from '@prisma/client';
import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { handle } from 'hono/vercel';
import { compareArrays, exclude, shuffleArray, verifyJWT } from '~/libs/tools';
import prisma from '~/prisma';

const app = new Hono<{ Variables: any }>().basePath('/api/signals')
const baseUrl = (c: any) => c.req.raw.nextUrl.origin + '/';

app.use(prettyJSON({ space: 2 }))
app.use(csrf({ origin: ['mee.fund'], }))
app.use('*', secureHeaders({ xFrameOptions: true, xXssProtection: true, }))

app.use('*', async (c, next) => {
  const queries = c.req.query()
  const method = c.req.method;
  const bodies = method == 'POST' && await c.req.json()

  c.set('base_url', baseUrl(c))
  c.set('queries', Object.keys(queries))
  c.set('validate', (keys: string[]) => compareArrays(c.get('payloads'), keys))

  if (method == 'GET' && !queries.token) return c.json({ error: 'TOKEN_REQUIRED' }, 403)
  if (method == 'POST' && !bodies.token) return c.json({ error: 'TOKEN_REQUIRED' }, 403)

  const token = method == 'GET' ? queries.token : bodies.token
  const isTokenValid = await verifyJWT(token);
  if (!isTokenValid) return c.json({ error: 'TOKEN_INVALID' }, 403)

  c.set('payload', isTokenValid)
  c.set('payloads', Object.keys(isTokenValid))

  return next()
})

// USER API
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
            reposts: true,
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

// POSTING API
app.post('/post/new', async (c) => {
  if (!c.get('validate')(['payload'])) return c.json({ error: 'INVALID_QUERY' }, 400)

  try {
    const post = await prisma.post.create({ data: c.get('payload')['payload'] })

    if (post) return c.json({ data: post })
    return c.json({ error: 'NOT_FOUND' }, 404)
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error)
    return c.json({ error: 'INTERNAL_SERVER_ERROR' }, 500)
  }
})

app.get('/post/detail', async (c) => {
  if (!c.get('validate')(['ids'])) return c.json({ error: 'INVALID_QUERY' }, 400)

  try {
    const post = await prisma.post.findUnique({
      where: {
        ids: c.get('payload')['ids']
      },
      select: {
        ids: true,
        content: true,
        category: true,
        created_at: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
            reposts: true,
          }
        },
        media: {
          select: {
            url: true,
            width: true,
            height: true,
            orientation: true,
            mimetype: true,
          }
        },
        user: {
          select: {
            name: true,
            username: true,
            is_verified: true,
            picture: true
          }
        }
      }
    })

    if (post) return c.json({ data: post })
    return c.json({ error: 'NOT_FOUND' }, 404)
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error)
    return c.json({ error: 'INTERNAL_SERVER_ERROR' }, 500)
  }
})

app.get('/posts', async (c) => {
  if (!c.get('validate')(['category', 'options', 'limit', 'offset', 'username'])) return c.json({ error: 'INVALID_QUERY' }, 400)

  try {
    const category = c.get('payload')['category'];
    const post = await prisma.post.findMany({
      take: Number(c.get('payload')['limit']),
      skip: Number(c.get('payload')['offset']),
      orderBy: { ...(c.get('payload')['options'] == 'newest' && { created_at: 'desc' }) },
      where: {
        ...(category != 'UMUM' && { category }),
        visibility: 'PUBLIC',
        user: {
          is_blocked: false,
          visibility: 'PUBLIC',
          ...(c.get('payload')['username'] && {
            username: c.get('payload')['username'],
            ...(c.get('payload')['options'] == 'reposts' && {
              reposts: {
                some: {
                  user: {
                    username: c.get('payload')['username']
                  }
                }
              }
            }),
            ...(c.get('payload')['options'] == 'likes' && {
              post_likes: {
                some: {
                  user: {
                    username: c.get('payload')['username']
                  }
                }
              }
            }),
            ...(c.get('payload')['options'] == 'bookmarks' && {
              bookmarks: {
                some: {
                  user: {
                    username: c.get('payload')['username']
                  }
                }
              }
            }),
          }),
        }
      },
      select: {
        ids: true,
        content: true,
        category: true,
        created_at: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
            reposts: true,
          }
        },
        media: {
          select: {
            url: true,
            width: true,
            height: true,
            orientation: true,
            mimetype: true,
          }
        },
        user: {
          select: {
            name: true,
            username: true,
            is_verified: true,
            picture: true
          }
        },
        comments: {
          orderBy: { likes: { _count: 'desc' } },
          take: 1,
          select: {
            user: {
              select: {
                name: true,
                username: true,
                is_verified: true,
                picture: true
              }
            },
            content: true,
            created_at: true
          }
        }
      }
    })

    if (post) return c.json({ data: c.get('payload')['options'] == 'default' ? shuffleArray(post) : post })
    return c.json({ error: 'NOT_FOUND' }, 404)
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error)
    return c.json({ error: 'INTERNAL_SERVER_ERROR' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)