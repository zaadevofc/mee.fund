import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { handle } from 'hono/vercel';
import { compareArrays, parseObj, stringObj, verifyJWT } from '~/libs/tools';
import { ActionsController } from '../actions/actions.controller';
import { CommentsController } from '../comments/comments.controller';
import { PostsController } from '../posts/posts.controller';
import { TagsController } from '../tags/tags.controller';
import { UserController } from '../users/users.controller';
import { MediaController } from '../media/media.controller';
import { SEO } from '~/consts';

const app = new Hono<{ Variables: any }>().basePath('/api/v1')
const baseUrl = (c: any) => c.req.raw.nextUrl.origin + '/';

export const MakeError = (code: number, error: string, cause: string) => { throw Error(stringObj({ code, error, cause })) }
export const MakeQueryError = () => MakeError(500, 'INTERNAL_SERVER_ERROR', 'Terjadi kesalahan query dari sistem.')

app.use('*', etag())
app.use('*', secureHeaders())
// app.use(csrf({ origin: [SEO.SITE_URL] }))
app.use(prettyJSON({ space: 2 }))

app.use('*', cors({
  origin: [SEO.SITE_URL],
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Authorization', 'Content-Type'],
  maxAge: 600,
  credentials: true,
}))

app.use('*',
  bearerAuth({
    async verifyToken(token, c) {
      const secret = process.env.NEXT_PUBLIC_APIKEY!
      const res = await verifyJWT(token);
      if (res) return res?.secret == secret;
      return false;
    },
  }),
  async (c, next) => {
    const method = c.req.method;
    const queries = c.req.query()
    const bodies = (method == 'POST' && c.req.path.match('/upload')) ? await c.req.parseBody() : (method == 'POST' && !c.req.path.match('/upload')) ? await c.req.json() : ''

    if (method == 'GET' && !queries.token) return c.json({ error: 'REQUIRED_TOKEN' }, 403)
    if (method == 'POST' && !bodies.token) return c.json({ error: 'REQUIRED_TOKEN' }, 403)

    const token = method == 'GET' ? queries.token : bodies.token
    const res = await verifyJWT(token);

    if (!res) return c.json({ error: 'INVALID_TOKEN' }, 403)

    c.set('payload', res)
    c.set('validate', (keys: string[]) => {
      const check = compareArrays(keys, Object.keys(res))
      console.log("🚀 ~ res:", res)
      if (!check) return MakeQueryError()
      return false
    })

    c.set('url', baseUrl(c))
    c.set('queries', Object.keys(queries))
    c.set('MakeError', MakeError)
    c.set('ParseError', (error: any) => {
      const parse = parseObj(error?.message)
      return c.json(parse, parse?.code)
    })

    return next()
  })

// CONTROL API
app.route('/users', UserController)
app.route('/posts', PostsController)
app.route('/comments', CommentsController)
app.route('/tags', TagsController)
app.route('/actions', ActionsController)
app.route('/media', MediaController)

export const GET = handle(app)
export const POST = handle(app)