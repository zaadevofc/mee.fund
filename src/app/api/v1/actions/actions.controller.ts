import { Hono } from "hono";
import { makeActions } from "./actions.service";
import { MakeError } from "../[[...route]]/route";

const app = new Hono<{ Variables: any }>()

app.post('/:type/:actions', async (c) => {
  try {
    const { type, actions } = c.req.param()
    const check = c.get('validate')(['post_id | comment_id', 'user_id'])
    if (check) return check;

    const { post_id, comment_id, user_id } = c.get('payload');

    const make = await makeActions({
      type, actions, post_id, comment_id, user_id
    } as any)

    if (!make) MakeError(400, 'FAILED_CREATE', `Gagal, silahkan ulangi.`)
    return c.json({ data: make })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})

export { app as ActionsController };
