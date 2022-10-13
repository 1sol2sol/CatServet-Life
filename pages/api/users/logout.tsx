import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";



async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  await req.session.destroy();
  
  res.json({ok:true});
}

export default withApiSession(withHandler("POST", handler));


