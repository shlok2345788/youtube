
export const getGeoLocation = async () => {
  try {
    // Add a simple timeout to the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
       throw new Error(`IP API failed with status ${response.status}`);
    }

    const data = await response.json();
    return {
      city: data.city,
      region: data.region,
      country: data.country_name
    };
  } catch (error) {
    console.warn("Geo-location lookup failed (probably rate-limited or blocked):", error.message);
    return null; // Return null so the app can continue with default theme
  }
};

export const isSouthIndia = (region) => {
  if (!region) return false;
  const southStates = [
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana"
  ];
  return southStates.some(state => region.toLowerCase().includes(state.toLowerCase()));
};

export const isWhiteThemeTime = () => {
  const now = new Date();
  const hours = now.getHours();
  // 10 AM to 12 PM
  return hours >= 10 && hours < 12;
};
