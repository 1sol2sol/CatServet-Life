import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const{phone} = req.body;
  const randomName = Math.random().toString(16).substr(2, 8);
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data:{
      payload,
      user: {
        connectOrCreate:{
          where:{
            phone: phone,
          },
          create:{
            nickname: randomName,
            phone: phone,
          }
        }
      }
    }
  });  
  if(phone){
    // await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to:process.env.MY_PHONE!, //phone
    //   body: `집사생활 인증번호: ${payload}`
    // })    
  }
  return res.json({
    ok:true
  });
}

export default withHandler({methods: ["POST"], handler, isPrivate: false});
