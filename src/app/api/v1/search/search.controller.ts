import { Hono } from "hono"
import { MakeSearch } from "./search.service"

const app = new Hono<{ Variables: any }>()

app.get('/', async (c) => {
  try {
    const check = c.get('validate')(['request_id', 'limit', 'offset', 'keyword', 'type'])
    if (check) return check

    const { limit, offset, request_id, keyword, type } = c.get('payload')

    const search = await MakeSearch({
      limit, offset, type, request_id, keyword
    })

    return c.json({ data: search });

  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})

export { app as SearchController }

