import { Prisma } from '@prisma/client';
import { Hono } from "hono"
import { getManyComments } from "../comments/comments.service"
import { createNewPost, getManyPosts, getPostDetail } from "./posts.service"
import { MakeError } from "../[[...route]]/route"
import { shuffleArray } from "~/libs/tools"

const app = new Hono<{ Variables: any }>()

app.get('/', async (c) => {
  try {
    const check = c.get('validate')(['limit', 'offset', 'username | request_id | category | type | random'])
    if (check) return check

    const { limit, offset, username, request_id, category, type, random } = c.get('payload');
    const periode = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const whereClause = {
      category,
      ...(!type && username && { user: { username } }),
      ...(type === 'likes' && { likes: { some: { user: { username } } } }),
      ...(type === 'bookmarks' && { bookmarks: { some: { user: { username } } } }),
      ...(type === 'reposts' && { reposts: { some: { user: { username } } } }),
      ...(type === 'trending' && {
        OR: [
          { created_at: { gte: periode } },
          { likes: { some: { created_at: { gte: periode } } } },
          { comments: { some: { created_at: { gte: periode } } } },
          { reposts: { some: { created_at: { gte: periode } } } },
        ]
      }),
    };

    const orderBy: Prisma.PostOrderByWithRelationInput[] | undefined = type === 'populer' || type === 'trending' ? [
      { likes: { _count: 'desc' } },
      { bookmarks: { _count: 'desc' } },
      { reposts: { _count: 'desc' } },
      { comments: { _count: 'desc' } },
    ] : undefined;

    const posts = await getManyPosts({
      limit,
      offset,
      request_id,
      random,
      type,
      options: {
        where: whereClause,
        orderBy
      }
    });

    if (posts && (type === 'trending' || type === 'populer')) {
      posts.posts.sort((a: any, b: any) => {
        const getScore = (post: any) => {
          if (type === 'trending') {
            return (post.likes?.length || 0) * 2 +
              (post.comments?.length || 0) * 3 +
              (post.reposts?.length || 0) * 4;
          } else {
            return (post._count?.likes || 0) +
              (post._count?.bookmarks || 0) * 2 +
              (post._count?.reposts || 0) * 3 +
              (post._count?.comments || 0) * 2;
          }
        };

        return getScore(b) - getScore(a);
      });

      posts.posts = posts.posts.slice(0, limit);
    }

    return c.json({ data: posts });

  } catch (error: any) {
    return c.get('ParseError')(error);
  }
});

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

app.get('/:id', async (c) => {
  try {
    const { id } = c.req.param()
    const check = c.get('validate')(['request_id'])
    if (check) return check

    const { request_id } = c.get('payload')
    const post = await getPostDetail({ ids: id, request_id })

    if (!post) MakeError(404, 'NOT_FOUND', 'Postingan tidak ditemukan.')

    return c.json({ data: post })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})

app.get('/:id/comments', async (c) => {
  try {
    const { id } = c.req.param()
    const check = c.get('validate')(['limit', 'offset', 'request_id'])
    if (check) return check

    const { limit, offset, post_id, request_id } = c.get('payload')
    const comments = await getManyComments({
      limit, offset, request_id, options: {
        where: { post: { ids: id }, parent_id: null }
      }
    })

    return c.json({ data: comments })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})

export { app as PostsController }
