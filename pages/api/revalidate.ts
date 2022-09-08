import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let path: string | string[];
    path = (req.query && req.query.path) || "";
    if (Array.isArray(path)) {
      path = path[0];
    }
    if (path) {
      await res.revalidate(path);
      return res.json({ revalidated: true });
    }
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    console.error(err);
    return res.status(500).send("Error revalidating");
  }
}
