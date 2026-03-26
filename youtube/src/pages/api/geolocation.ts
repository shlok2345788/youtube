import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const upstream = await fetch("https://get.geojs.io/v1/ip/geo.json", {
      headers: { Accept: "application/json" },
    });

    if (!upstream.ok) {
      return res.status(502).json({ message: "Failed to resolve geolocation" });
    }

    const data = await upstream.json();
    return res.status(200).json({
      city: data.city || null,
      region: data.region || null,
      country_name: data.country || null,
    });
  } catch {
    return res.status(500).json({ message: "Geolocation lookup failed" });
  }
}
