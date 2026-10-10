import { NextRequest, NextResponse } from 'next/server';
import { WeatherData } from '@/lib/types';
import { mapWeatherCode } from '@/lib/weather';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&timezone=auto`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open-Meteo returned ${response.status}`);
      }

      const data = await response.json();
      const current = data.current;

      if (!current) {
        throw new Error('Invalid response structure');
      }

      const gameCategory = mapWeatherCode(current.weather_code);
      const weatherData: WeatherData = {
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        precipitation: current.precipitation,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        gameCategory,
        description: gameCategory, // using string for now, it's just description
        icon: '☁️', // placeholder
        lastUpdated: Date.now()
      };

      const res = NextResponse.json(
        { success: true, data: weatherData },
        { status: 200 }
      );
      
      // Cache for 5 minutes
      res.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate');
      return res;

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'Weather API timeout' },
          { status: 504 }
        );
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
