import { Hono } from "hono"
import { createNewComment } from "./comments.service"
import { MakeError } from "../[[...route]]/route"

const app = new Hono<{ Variables: any }>()

app.post('/new', async (c) => {
  try {
    const check = c.get('validate')(['payload'])
    if (check) return check;

    const { payload } = c.get('payload')
    const comment = await createNewComment({ payload })

    if (!comment) MakeError(400, 'FAILED_CREATE', 'Gagal menambahkan komentar, silahkan ulangi.')
    
    return c.json({ data: comment })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})


export { app as CommentsController }

