import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { csrf } from 'hono/csrf';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { handle } from 'hono/vercel';
import { compareArrays, parseObj, stringObj, verifyJWT } from '~/libs/tools';
import { ActionsController } from '../actions/actions.controller';
import { CommentsController } from '../comments/comments.controller';
import { PostsController } from '../posts/posts.controller';
import { TagsController } from '../tags/tags.controller';
import { UserController } from '../users/users.controller';

const app = new Hono<{ Variables: any }>().basePath('/api/v1')
const baseUrl = (c: any) => c.req.raw.nextUrl.origin + '/';

export const MakeError = (code: number, error: string, cause: string) => { throw Error(stringObj({ code, error, cause })) }
export const MakeQueryError = () => MakeError(500, 'INTERNAL_SERVER_ERROR', 'Terjadi kesalahan query dari sistem.')

app.use('*', secureHeaders({ xFrameOptions: true, xXssProtection: true, }))
app.use(csrf({ origin: ['mee.fund'], }))
app.use(prettyJSON({ space: 2 }))

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
    const queries = c.req.query()
    const method = c.req.method;
    const bodies = method == 'POST' && await c.req.json()

    if (method == 'GET' && !queries.token) return c.json({ error: 'REQUIRED_TOKEN' }, 403)
    if (method == 'POST' && !bodies.token) return c.json({ error: 'REQUIRED_TOKEN' }, 403)

    const token = method == 'GET' ? queries.token : bodies.token
    const res = await verifyJWT(token);

    if (!res) return c.json({ error: 'INVALID_TOKEN' }, 403)

    c.set('payload', res)
    c.set('validate', (keys: string[]) => {
      const check = compareArrays(keys, Object.keys(res))
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

export const GET = handle(app)
export const POST = handle(app)