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
    body: {answer}
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
    }
  })

  if(req.method === "POST") {
     // 댓글 생선전 post 존재하는지 확인 여부 코드 추가 필요 !
  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        }
      },
      post: {
        connect: {
          id: Number(id)
        }
      },
      answer,
    }
  })  
  res.json({
    ok: true,
    answer: newAnswer,
  });
  }

  if(req.method === "DELETE") {
    const {body} = req;
    console.log(body);
    
    const answer = await client.answer.delete({
      where: {
        id: Number(body),
      }
    })
    res.json({ok: true})  
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "DELETE"],
    handler,
  })
);
