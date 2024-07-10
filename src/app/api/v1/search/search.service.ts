import { ratio } from 'fuzzball';
import natural from 'natural';
import { MakeQueryError } from "../[[...route]]/route";
import { getManyMedia } from "../media/media.service";
import { getManyPosts } from "../posts/posts.service";
import { getManyTags } from "../tags/tags.service";
import { getManyUsers } from "../users/users.service";

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

export type MakeSearchType = {
  type: 'posts' | 'users' | 'tags' | 'media';
  keyword: string;
  request_id?: string;
  limit?: number;
  offset?: number;
}

function preprocessKeyword(keyword: string): string[] {
  const tokens = tokenizer.tokenize(keyword.toLowerCase());
  const stemmed = tokens.map(token => stemmer.stem(token));
  const bigrams = [];
  for (let i = 0; i < stemmed.length - 1; i++) {
    bigrams.push(stemmed[i] + ' ' + stemmed[i + 1]);
  }

  return [...stemmed, ...bigrams];
}

function fuzzyMatch(target: string, keyword: string): boolean {
  return ratio(keyword, target) > 0.3;
}

export const MakeSearch = async (props: MakeSearchType): Promise<any> => {
  try {
    const processedKeywords = preprocessKeyword(props.keyword);

    const search: Record<string, () => Promise<any>> = {
      posts: async () => (await getManyPosts({
        request_id: props.request_id,
        limit: props.limit,
        offset: props.offset,
        options: {
          where: {
            OR: [
              ...processedKeywords.map(kw => ({ content: { contains: kw, mode: 'insensitive' } })),
              ...processedKeywords.map(kw => ({ tags: { some: { name: { contains: kw, mode: 'insensitive' } } } }))
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
                ...processedKeywords.map(kw => ({ name: { contains: kw, mode: 'insensitive' } })),
                ...processedKeywords.map(kw => ({ username: { contains: kw, mode: 'insensitive' } })),
                ...processedKeywords.map(kw => ({ bio: { contains: kw, mode: 'insensitive' } }))
              ],
              visibility: 'PUBLIC'
            },
            orderBy: [
              { followers: { _count: 'desc' } },
              { created_at: 'desc' }
            ]
          }
        } as any);
        return users.filter((user: any) =>
          fuzzyMatch(user.name || '', props.keyword) ||
          fuzzyMatch(user.username || '', props.keyword) ||
          fuzzyMatch(user.bio || '', props.keyword)
        );
      },
      tags: async () => {
        const tags: any = await getManyTags({
          limit: props.limit,
          offset: props.offset,
          options: {
            where: {
              OR: processedKeywords.map(kw => ({ name: { contains: kw, mode: 'insensitive' } }))
            },
            select: { _count: { select: { posts: true } } },
            orderBy: [{ posts: { _count: 'desc' } }]
          }
        } as any);
        return tags.filter((tag: any) => fuzzyMatch(tag.name || '', props.keyword));
      },
      media: async () => await getManyMedia({
        limit: props.limit,
        offset: props.offset,
        options: {
          where: {
            OR: [
              ...processedKeywords.map(kw => ({ file_name: { contains: kw, mode: 'insensitive' } })),
              ...processedKeywords.map(kw => ({ post: { content: { contains: kw, mode: 'insensitive' } } }))
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