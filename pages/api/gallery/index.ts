import { log } from 'console';
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if(req.method === "GET"){
    
    const photo = await client.gallery.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count : {
          select: {
            scores: true,
          }
        }
      }
    })
    res.json({ok: true, photo})
  }
  if(req.method === "POST"){
    const {
      body: { photoId },
      session: { user },
    } = req;
    const photo = await client.gallery.create({
      data: {
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
      photo,
    });
    console.log(photo);
    
  }
  
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
