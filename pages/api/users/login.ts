import client from "@libs/server/client";
import mail from "@sendgrid/mail";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

mail.setApiKey(process.env.SENDGRID_KEY!);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, latitude, longitude } = req.body;

  const randomName = Math.random().toString(16).substr(2, 8);
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            email: email,
          },
          create: {
            nickname: randomName,
            email: email,
            latitude: latitude,
            longitude: longitude,
          },
        },
      },
    },
  });
  if (email) {
    const sendEmail = await mail.send({
      from: process.env.MY_EMAIL!,
      to: email,
      subject: "집사생활 인증 메일",
      text: `인증번호는 ${payload}`,
      html: `<strong>인증번호는 ${payload}</strong>`,
    });
  }

  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
