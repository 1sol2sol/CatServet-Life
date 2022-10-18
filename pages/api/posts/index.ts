import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question, category },
    session: { user },
  } = req;

  const post = await client.post.create({
    data: {
      question,
      categories: {
        create: {
          name: category,
        }
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.json({
    ok: true,
    post,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
