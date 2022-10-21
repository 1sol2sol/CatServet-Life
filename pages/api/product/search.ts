import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    body: { title },
  } = req;

  const products = await client.product.findMany({
    where: {
      name: {
        contains: title,
      },
    },
    orderBy: [
      {
        created: "desc",
      },
    ],
    include: {
      _count: {
        select: {
          favs: true,
          chatRooms: true,
        },
      },
    },
  });

  res.json({ ok: true, products });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
