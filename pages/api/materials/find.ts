import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const materials = await fetch(
    `https://bm-materials.com/material/${req.query.name}/find`
  ).then((response) => response.json());
  res.status(200).json(materials);
};

export default handler;
