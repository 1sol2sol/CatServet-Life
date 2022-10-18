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
    session: { user },
  } = req;

  const exists = await client.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: Number(id)
    },
    select: {
      id: true,
    }
  })
  if(exists){
    await client.wondering.delete({
      where: {
        id: exists.id,
      }
    })
  } else {
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id
          }
        },
        post: {
          connect: {
            id: Number(id)
          }
        }
      }
    })
  }
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
