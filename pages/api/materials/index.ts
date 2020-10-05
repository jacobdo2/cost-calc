import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const materials = await fetch(
    `${process.env.API_URL}/material/all`
  ).then((response) => response.json());

  res.status(200).json(materials);
};

export default handler;
