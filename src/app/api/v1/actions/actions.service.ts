import prisma from "~/prisma";
import { MakeQueryError } from "../[[...route]]/route";

export type makeActionsType = ({
  type: 'posts';
  post_id: string;
  actions: 'likes' | 'bookmarks' | 'reposts';
} | {
  type: 'comments';
  comment_id: string;
  actions: 'likes'
}) & {
  user_id: string;
}

export const makeActions = async (props: makeActionsType) => {
  try {
    const init = {
      posts: { likes: 'postLike', bookmarks: 'bookmark', reposts: 'repost' },
      comments: { likes: 'commentLike' },
    }

    const actions = await prisma.$transaction(async (tx) => {
      let check;

      const txKey = tx[(init as any)[props.type][props.actions]] as any
      const connectKey = (props['type'] == 'posts' && props.post_id) || (props['type'] == 'comments' && props.comment_id)

      if (props.type === 'posts') {
        check = await txKey.findUnique({
          where: {
            user_id_post_id: {
              user_id: props.user_id,
              post_id: props.post_id
            }
          }
        });
      }

      if (props.type === 'comments') {
        check = await txKey.findUnique({
          where: {
            user_id_comment_id: {
              user_id: props.user_id,
              comment_id: props.comment_id
            }
          }
        });
      }

      const key = props.type.slice(0, -1);

      if (check) {
        await txKey.delete({ where: { id: check.id } });
        return { action: 'un' + key };
      } else {
        await txKey.create({
          data: {
            user: { connect: { id: props.user_id } },
            [key]: { connect: { id: connectKey } }
          }
        });
        return { action: key };
      }
    });

    return actions
  } catch (e) {
    console.log("🚀 ~ makeActions ~ e:", e)
    MakeQueryError()
  }
}