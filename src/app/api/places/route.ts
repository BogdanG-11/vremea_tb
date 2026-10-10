import { NextRequest, NextResponse } from 'next/server';
import { Place } from '@/lib/types';
import { haversineDistance } from '@/lib/distance';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const radiusStr = searchParams.get('radius');

    if (!latStr || !lonStr) {
      return NextResponse.json(
        { success: false, error: 'Missing lat or lon parameter' },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        { success: false, error: 'Invalid lat or lon parameter' },
        { status: 400 }
      );
    }

    let radius = 1500;
    if (radiusStr) {
      const r = parseInt(radiusStr, 10);
      if (!isNaN(r)) {
        radius = Math.min(Math.max(r, 100), 5000); // max 5000m
      }
    }

    const overpassQuery = `
      [out:json][timeout:15];
      (
        node["amenity"~"cafe|restaurant"](around:${radius},${lat},${lon});
        node["leisure"="park"](around:${radius},${lat},${lon});
        node["tourism"~"museum|attraction"](around:${radius},${lat},${lon});
        node["historic"~"monument|memorial"](around:${radius},${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    let overpassFailed = false;
    let places: Place[] = [];

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        overpassFailed = true;
      } else if (!response.ok) {
        overpassFailed = true;
      } else {
        const data = await response.json();
        if (data && data.elements) {
          const parsedPlaces = data.elements.map((element: any) => {
            const name = element.tags?.name || 'Unknown Location';
            let category = 'other';
            if (element.tags?.amenity) category = element.tags.amenity;
            else if (element.tags?.leisure) category = element.tags.leisure;
            else if (element.tags?.tourism) category = element.tags.tourism;
            else if (element.tags?.historic) category = element.tags.historic;

            return {
              id: element.id.toString(),
              name,
              category: category as any,
              lat: element.lat,
              lon: element.lon,
            };
          });

          places = parsedPlaces
            .filter((p: Place) => p.name !== 'Unknown Location')
            .map((p: Place) => ({
              ...p,
              distance: haversineDistance(lat, lon, p.lat, p.lon)
            }))
            .sort((a: Place, b: Place) => (a.distance || 0) - (b.distance || 0));
        }
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      overpassFailed = true;
    }

    if (overpassFailed || places.length === 0) {
      // Fallback to demo data
      const generateDemoPlace = (id: string, name: string, category: string, dLat: number, dLon: number) => ({
        id,
        name,
        category: category as any,
        lat: lat + dLat,
        lon: lon + dLon,
        distance: haversineDistance(lat, lon, lat + dLat, lon + dLon)
      });

      places = [
        generateDemoPlace('d1', 'Central Park', 'park', 0.005, 0.002),
        generateDemoPlace('d2', 'The Old Cafe', 'cafe', -0.002, 0.003),
        generateDemoPlace('d3', 'City Museum', 'museum', 0.008, -0.001),
        generateDemoPlace('d4', 'Heroes Monument', 'monument', -0.004, -0.005),
        generateDemoPlace('d5', 'Local Restaurant', 'restaurant', 0.001, 0.008),
        generateDemoPlace('d6', 'Riverside Park', 'park', -0.006, 0.007),
        generateDemoPlace('d7', 'Historic Memorial', 'memorial', 0.003, -0.006),
        generateDemoPlace('d8', 'Tourist Attraction', 'attraction', 0.009, 0.004),
      ].sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return NextResponse.json(
        { success: true, data: { places, demo: true } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, data: { places, demo: false } },
      { status: 200 }
    );

  } catch (error) {
    console.error('Places API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}
