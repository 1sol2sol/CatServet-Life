import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {session: {user}} = req;
  
  const products = await client.product.findMany({
    orderBy: {
      created: "desc",
    },
    where: {
      user: {
        id: user?.id,
      },
    },
    include: {
      _count: {
        select: {
          favs: true,
          chatRooms: true,
        }
      }
    }
  })

  const posts = await client.post.findMany({
    orderBy: {
      created: "desc",
    },
    where:{
      user: {
        id: user?.id,
      }
    },
    include: {
      categories: {
        select: {
          name: true,
        }
      },
      _count: {
        select: {
          wonderings: true,
          answers: true,
        }
      }
    }
  })
  res.json({
    ok: true,
    products,posts
  });
}

export default withApiSession(withHandler({
  methods: ["GET"],
  handler,
}));
