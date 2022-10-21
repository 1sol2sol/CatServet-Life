import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id, buyerId },
    session: { user },
    body: { review },
  } = req;

  await client.review.create({
    data: {
      review: review,
      createdBy: {
        connect: {
          id: user?.id,
        },
      },
      createdFor: {
        connect: {
          id: Number(buyerId),
        },
      },
      product: {
        connect: {
          id: Number(id),
        },
      },
    },
  });

  await client.sale.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      product: {
        connect: {
          id: Number(id),
        },
      },
    },
  });

  await client.purchase.create({
    data: {
      user: {
        connect: {
          id: Number(buyerId),
        },
      },
      product: {
        connect: {
          id: Number(id),
        },
      },
    },
  });

  await client.product.update({
    where: {
      id: Number(id),
    },
    data: {
      state: "판매완료",
    }
  })

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
