import type { NextApiRequest, NextApiResponse } from "next";

// Disable the default body parser to allow streaming multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // This is a mock upload endpoint.
  // In a real app, you would parse the incoming form-data and store the file.
  // For now, just respond with success so the UI can proceed.
  return res.status(200).json({ message: "Upload received (mock endpoint)" });
}


