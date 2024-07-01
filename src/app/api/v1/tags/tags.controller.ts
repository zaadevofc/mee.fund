import { Hono } from "hono";
import { getManyTags } from "./tags.service";

const app = new Hono<{ Variables: any }>()

app.get('/trending', async (c) => {
  try {
    const check = c.get('validate')(['limit', 'offset'])
    if (check) return check

    const { limit, offset } = c.get('payload')
    const tags = await getManyTags({
      limit, offset, options: {
        select: { name: true, _count: { select: { posts: true, } } },
        orderBy: { posts: { _count: 'desc' } }
      }
    })

    return c.json({ data: tags })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})


export { app as TagsController }