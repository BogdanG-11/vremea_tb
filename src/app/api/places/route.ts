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

    let radius = 5000;
    if (radiusStr) {
      const r = parseInt(radiusStr, 10);
      if (!isNaN(r)) {
        radius = Math.min(Math.max(r, 100), 5000); // max 5000m
      }
    }

    const overpassQuery = `
      [out:json][timeout:15];
      (
        node["amenity"~"cafe|restaurant|place_of_worship"](around:${radius},${lat},${lon});
        node["leisure"~"park|nature_reserve"](around:${radius},${lat},${lon});
        node["tourism"~"museum|attraction|viewpoint|guest_house|hotel|chalet"](around:${radius},${lat},${lon});
        node["historic"~"monument|memorial|ruins|wayside_cross"](around:${radius},${lat},${lon});
        node["natural"~"peak|spring|water"](around:${radius},${lat},${lon});
        node["sport"~"skiing"](around:${radius},${lat},${lon});
        way["piste:type"](around:${radius},${lat},${lon});
      );
      out body center;
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
            const name = element.tags?.name || (element.tags?.['piste:type'] ? 'Pârtie de schi' : 'Loc de interes');
            let category = 'other';
            if (element.tags?.amenity) category = element.tags.amenity;
            else if (element.tags?.leisure) category = element.tags.leisure;
            else if (element.tags?.tourism) category = element.tags.tourism;
            else if (element.tags?.historic) category = element.tags.historic;
            else if (element.tags?.natural) category = element.tags.natural;
            else if (element.tags?.['piste:type'] || element.tags?.sport === 'skiing') category = 'ski';

            return {
              id: element.id.toString(),
              name,
              category: category as any,
              lat: element.lat || element.center?.lat,
              lon: element.lon || element.center?.lon,
            };
          });

          places = parsedPlaces
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
        generateDemoPlace('d1', 'Pârtia de schi', 'ski', 0.005, 0.002),
        generateDemoPlace('d2', 'Cabana Rustică', 'hotel', -0.002, 0.003),
        generateDemoPlace('d3', 'Vârful Înalt', 'peak', 0.008, -0.001),
        generateDemoPlace('d4', 'Biserica de lemn', 'place_of_worship', -0.004, -0.005),
        generateDemoPlace('d5', 'Restaurant Tradițional', 'restaurant', 0.001, 0.008),
        generateDemoPlace('d6', 'Poiana Mare', 'park', -0.006, 0.007),
        generateDemoPlace('d7', 'Troița Veche', 'historic', 0.003, -0.006),
        generateDemoPlace('d8', 'Punct de belvedere', 'viewpoint', 0.009, 0.004),
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
