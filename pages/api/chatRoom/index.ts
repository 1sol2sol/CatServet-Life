import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body,
    session: { user },
  } = req;  

  const product = await client.product.findUnique({
    where: {
      id: Number(body),
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  
  if(req.method === "GET"){
    const chatRooms = await client.chatRoom.findMany({
      include: {
        messages: {
          orderBy: {
            updatedAt: "desc"
          }
        },
        buyer: true,
        seller: true,
      }
    })
    res.json({ ok: true, chatRooms });
  }
  if (req.method === "POST") {
    const isChatRoom = await client.chatRoom.findFirst({
      where: {
        productId: Number(body),
        buyerId: user?.id,
        sellerId: product?.userId,
      },
    });
    
    if (isChatRoom) {
      res.json({ ok: true, isChatRoom });
    } else {
      const chatRoom = await client.chatRoom.create({
        data: {
          product: {
            connect: {
              id: Number(body),
            },
          },
          buyer: {
            connect: {
              id: user?.id,
            },
          },
          seller: {
            connect: {
              id: product?.userId,
            },
          },
        },
      });
      res.json({
        ok: true,
        chatRoom,
      });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
