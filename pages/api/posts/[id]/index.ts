import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    body: { category },
    session: {user},
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
      answers: {
        select: {
          answer: true,
          id: true,
          created: true,
          user: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            }
          }
        }
      },
      _count: {
        select: {
          answers: true,
          wonderings: true,
        },
      },
    },
  });


  const isWondering = Boolean(
    await client.wondering.findFirst({
      where: {
        postId: Number(id),
        userId: user?.id,
      },
      select: {
        id: true,
      }
    })
  )

  res.json({
    ok: true,
    post,
    isWondering
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
