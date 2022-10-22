import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {body, session: {user}}= req;
  
  if(req.method === "POST"){
    const exists = await client.score.findFirst({
      where: {
        userId: user?.id,
        galleryId: body,
      },
      select: {
        id: true,
      }
    })
    if(exists){
      await client.score.delete({
        where: {
          id: exists.id,
        }
      })
    } else {
      await client.score.create({
        data: {
          user: {
            connect: {
              id: user?.id
            }
          },
          gallery: {
            connect: {
              id: body,
            }
          }
        }
      })
    }
  
    res.json({ok:true})
  }
  
  
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
