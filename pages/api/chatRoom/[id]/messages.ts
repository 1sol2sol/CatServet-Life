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
    body
  } = req;

  const message = await client.messages.create({
    data: {
      message: body.message,
      chatRoom: {
        connect: {
          id: Number(id),
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  console.log(message);
  
  res.json({ok: true, message})
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
