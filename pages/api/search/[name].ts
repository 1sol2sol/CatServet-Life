import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {name} = req.query;
  
  const result = await client.product.findMany({
    where: {
      name: {
        search: name+"",
      },
    }
  })

  res.json({ok:true, result})
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
