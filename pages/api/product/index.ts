import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if(req.method === "GET"){
    const {
      query: { latitude, longitude, range, page },
    } = req;

    const parsedLatitude = parseFloat(latitude!.toString());
    const parsedLongitude = parseFloat(longitude!.toString());
    const parsedRange = parseFloat(range!.toString());

    const products = await client.product.findMany({
      orderBy: {
        created: "desc",
      },
      where: {
        state: "판매중",
        latitude: {
          gte: parsedLatitude - parsedRange,
          lte: parsedLatitude + parsedRange,
        },
        longitude: {
          gte: parsedLongitude - parsedRange,
          lte: parsedLongitude + parsedRange,
        }
      },
      include: {
        _count: {
          select: {
            favs: true,
            chatRooms: true,
          }
        },
      },
      take: 15,
      skip: (Number(page) - 1) * 15
    });
    res.json({ok: true, products})
  }
  if(req.method === "POST"){
    const {
      body: { name, price, description, photoId },
      session: { user },
    } = req;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: photoId,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      product,
    });
  }
  
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
