import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if(req.method === "GET"){
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });
    res.json({
      ok: true,
      profile,
    });
  }
  if(req.method === "PUT"){
    const {
      session: {user},
      body: {nickname, avatarId}
    } = req;
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });
    if(nickname && nickname !== currentUser?.nickname){
      const exists = Boolean(
        await client.user.findUnique({
          where: {
            nickname,
          },
          select: {
            id: true,
          }
        })
      )
      if(exists){
        return res.json({
          ok: false,
          error: "이미 사용중인 닉네임입니다."
        })
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          nickname,
        }
      })
      res.json({ok: true})
    }
    if(avatarId){
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
        }
      })
    }
    res.json({ok: true})
  }
}

export default withApiSession(withHandler({
  methods: ["GET", "PUT"],
  handler,
}));
