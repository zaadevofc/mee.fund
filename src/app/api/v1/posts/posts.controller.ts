import { Hono } from "hono"
import { getManyComments } from "../comments/comments.service"
import { createNewPost, getManyPosts, getPostDetail } from "./posts.service"
import { MakeError } from "../[[...route]]/route"
import { shuffleArray } from "~/libs/tools"

const app = new Hono<{ Variables: any }>()

app.get('/', async (c) => {
  try {
    const check = c.get('validate')(['limit', 'offset', 'username | request_id | category | type'])
    if (check) return check

    const { limit, offset, username, request_id, category, type } = c.get('payload');

    const posts = await getManyPosts({
      limit, offset, request_id, options: {
        where: {
          category,
          ...(username && { user: { username } }),
          ...(type == 'likes' && { likes: { some: { user: { id: request_id } } } }),
          ...(type == 'bookmarks' && { bookmarks: { some: { user: { id: request_id } } } }),
          ...(type == 'reposts' && { reposts: { some: { user: { id: request_id } } } }),
        }
      }
    })

    let random = type == 'random' && ({ ...posts, posts: shuffleArray(posts?.posts!) })
    return c.json({ data: random || posts })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})

app.post('/new', async (c) => {
  try {
    const check = c.get('validate')(['payload'])
    if (check) return check

    const { payload } = c.get('payload')
    const post = await createNewPost({ payload })

    if (!post) MakeError(400, 'FAILED_CREATE', 'Gagal membuat postingan, silahkan ulangi.')

    return c.json({ data: post })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})

app.get('/detail', async (c) => {
  try {
    const check = c.get('validate')(['ids | request_id'])
    if (check) return check

    const { ids, request_id } = c.get('payload')
    const post = await getPostDetail({ ids, request_id })

    if (!post) MakeError(404, 'NOT_FOUND', 'Postingan tidak ditemukan.')

    return c.json({ data: post })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})

app.get('/comments', async (c) => {
  try {
    const check = c.get('validate')(['limit', 'offset', 'post_id | request_id'])
    if (check) return check

    const { limit, offset, post_id, request_id } = c.get('payload')
    const comments = await getManyComments({
      limit, offset, request_id, options: {
        where: { post: { ids: post_id }, parent_id: null }
      }
    })

    return c.json({ data: comments })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})

export { app as PostsController }
