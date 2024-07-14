import { MakeQueryError } from "../[[...route]]/route";
import { getManyMedia } from "../media/media.service";
import { getManyPosts } from "../posts/posts.service";
import { getManyTags } from "../tags/tags.service";
import { getManyUsers } from "../users/users.service";

export type MakeSearchType = {
  type: 'posts' | 'users' | 'tags' | 'media';
  keyword: string;
  request_id?: string;
  limit?: number;
  offset?: number;
}

export const MakeSearch = async (props: MakeSearchType): Promise<any> => {
  try {

    const search: Record<string, () => Promise<any>> = {
      posts: async () => (await getManyPosts({
        request_id: props.request_id,
        limit: props.limit,
        offset: props.offset,
        options: {
          where: {
            OR: [
              { content: { contains: props.keyword, mode: 'insensitive' } },
              { tags: { some: { name: { contains: props.keyword, mode: 'insensitive' } } } }
            ],
            visibility: 'PUBLIC'
          },
          orderBy: [
            { likes: { _count: 'desc' } },
            { comments: { _count: 'desc' } },
            { created_at: 'desc' }
          ]
        }
      } as any))?.posts,
      users: async () => {
        const users: any = await getManyUsers({
          request_id: props.request_id,
          limit: props.limit,
          offset: props.offset,
          options: {
            where: {
              OR: [
                { name: { contains: props.keyword, mode: 'insensitive' } },
                { username: { contains: props.keyword, mode: 'insensitive' } },
                { bio: { contains: props.keyword, mode: 'insensitive' } }
              ],
              visibility: 'PUBLIC'
            },
            orderBy: [
              { followers: { _count: 'desc' } },
              { created_at: 'desc' }
            ]
          }
        } as any);
        return users
      },
      tags: async () => {
        const tags: any = await getManyTags({
          limit: props.limit,
          offset: props.offset,
          options: {
            where: {
              OR: { name: { contains: props.keyword, mode: 'insensitive' } }
            },
            select: { _count: { select: { posts: true } } },
            orderBy: [{ posts: { _count: 'desc' } }]
          }
        } as any);
        return tags
      },
      media: async () => await getManyMedia({
        limit: props.limit,
        offset: props.offset,
        options: {
          where: {
            OR: [
              { file_name: { contains: props.keyword, mode: 'insensitive' } },
              { post: { content: { contains: props.keyword, mode: 'insensitive' } } }
            ],
            post: { visibility: 'PUBLIC' }
          },
          select: { url: true, mimetype: true, post: { select: { ids: true, } } },
          orderBy: [
            { post: { likes: { _count: 'desc' } } },
            { created_at: 'desc' }
          ]
        }
      } as any)
    };

    const result = await search[props.type]();

    return result;
  } catch (e) {
    console.log("🚀 ~ MakeSearch ~ e:", e)
    MakeQueryError()
  }
}