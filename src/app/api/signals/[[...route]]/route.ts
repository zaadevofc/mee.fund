import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { handle } from 'hono/vercel';
import { getXataClient } from '~/libs/xata';
import prisma from '~/prisma';
const xata = getXataClient();

const app = new Hono().basePath('/api/signals')
const baseUrl = (c: any) => c.req.raw.nextUrl.origin + '/';

app.use(prettyJSON({ space: 2 }))
app.use(csrf({ origin: ['mee.fund'], }))
app.use('*', secureHeaders({ xFrameOptions: true, xXssProtection: true, }))

app.get('/list', async (c) => {
  // const data = await prisma.user.findMany()
  const x = await xata.db.users.getMany()
  return c.json({ data: 'hallo ngetes api', x })
})

export const GET = handle(app)
export const POST = handle(app)