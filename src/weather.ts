export type WeatherKind =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export type WeatherSnapshot = {
  kind: WeatherKind;
  label: string;
  labelBn: string;
  tempC: number;
  place: string;
  timezone: string;
};

type Coords = { lat: number; lon: number };

function codeToKind(code: number): WeatherKind {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rain";
  if (code <= 77 || (code >= 85 && code <= 86)) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}

function labelsFor(kind: WeatherKind): { en: string; bn: string } {
  switch (kind) {
    case "clear":
      return { en: "Clear sky", bn: "পরিষ্কার আকাশ" };
    case "cloudy":
      return { en: "Soft clouds", bn: "মেঘলা আকাশ" };
    case "fog":
      return { en: "Misty air", bn: "কুয়াশা" };
    case "drizzle":
      return { en: "Light drizzle", bn: "গুঁড়ি গুঁড়ি বৃষ্টি" };
    case "rain":
      return { en: "Rain falling", bn: "বৃষ্টি পড়ছে" };
    case "snow":
      return { en: "Snow drifting", bn: "তুষার ঝরছে" };
    case "storm":
      return { en: "Storm nearby", bn: "ঝড়ের আভাস" };
  }
}

async function locate(): Promise<Coords & { place: string }> {
  const geo = await new Promise<GeolocationPosition | null>((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  });

  if (geo) {
    const lat = geo.coords.latitude;
    const lon = geo.coords.longitude;
    const place = await reversePlace(lat, lon);
    return { lat, lon, place };
  }

  // IP fallback when permission denied / unavailable
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = (await res.json()) as {
        latitude?: number;
        longitude?: number;
        city?: string;
        region?: string;
        country_name?: string;
      };
      if (typeof data.latitude === "number" && typeof data.longitude === "number") {
        const place = [data.city, data.region || data.country_name]
          .filter(Boolean)
          .join(", ");
        return { lat: data.latitude, lon: data.longitude, place: place || "Near you" };
      }
    }
  } catch {
    /* ignore */
  }

  // Last resort: keep time local via browser TZ; weather for a gentle default
  return { lat: 23.8103, lon: 90.4125, place: "Your sky" };
}

async function reversePlace(lat: number, lon: number): Promise<string> {
  try {
    const geoRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    );
    if (geoRes.ok) {
      const g = (await geoRes.json()) as {
        city?: string;
        locality?: string;
        principalSubdivision?: string;
        countryName?: string;
      };
      const place = [g.city || g.locality, g.principalSubdivision || g.countryName]
        .filter(Boolean)
        .join(", ");
      if (place) return place;
    }
  } catch {
    /* ignore */
  }
  return "Near you";
}

export async function fetchWeather(): Promise<WeatherSnapshot> {
  const { lat, lon, place } = await locate();
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather request failed");
  const data = (await res.json()) as {
    timezone?: string;
    current?: { temperature_2m?: number; weather_code?: number };
  };

  const code = data.current?.weather_code ?? 2;
  const kind = codeToKind(code);
  const labels = labelsFor(kind);
  const tempC = Math.round(data.current?.temperature_2m ?? 0);

  return {
    kind,
    label: labels.en,
    labelBn: labels.bn,
    tempC,
    place,
    timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function formatLocalTime(timezone: string, now = new Date()): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
}

export function formatLocalDate(timezone: string, now = new Date()): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(now);
}
