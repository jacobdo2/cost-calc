import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const material = await fetch(
    `${process.env.API_URL}/material/${req.query.id}/get`
  ).then((response) => response.json());
  res.status(200).json(material);
};

export default handler;
