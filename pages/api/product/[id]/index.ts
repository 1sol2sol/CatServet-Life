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

  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
      chatRooms: {
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          buyer: true,
          messages: true,
        },
      },
    },
  });
  if (req.method === "GET") {
    const terms = product?.name.split(" ").map((word) => ({
      name: {
        contains: word,
      },
    }));
    const relatedProducts = await client.product.findMany({
      where: {
        OR: terms,
        AND: {
          id: {
            not: product?.id,
          },
        },
      },
    });
    const isLiked = Boolean(
      await client.fav.findFirst({
        where: {
          productId: product?.id,
          userId: user?.id,
        },
      })
    );
    res.json({ ok: true, product, isLiked, relatedProducts });
  }
  if (req.method === "DELETE") {
    await client.product.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "DELETE"],
    handler,
  })
);
