import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    body: { title },
    query: {latitude, longitude, range}
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

  const parsedLatitude = parseFloat(latitude!.toString());
    const parsedLongitude = parseFloat(longitude!.toString());
    const parsedRange = parseFloat(range!.toString());

  const posts = await client.post.findMany({
    where: {
      question: {
        contains: title,
      },
      latitude: {
        gte: parsedLatitude - parsedRange,
        lte: parsedLatitude + parsedRange,
      },
      longitude: {
        gte: parsedLongitude - parsedRange,
        lte: parsedLongitude + parsedRange,
      }
    },
    orderBy: [
      {
        created: "desc"
      }
    ],
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        }
      },
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
  res.json({ ok: true, products, posts });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
