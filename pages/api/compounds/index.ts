import { NextApiRequest, NextApiResponse } from "next";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const compounds = await fetch(
    "https://bm-materials.com/chemical"
  ).then((response) => response.json());
  res.status(200).json(compounds);
};

export default handler;
