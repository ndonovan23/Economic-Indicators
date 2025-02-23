import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.FRED_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is missing' }, { status: 500 });
    }

    const yields = [
      { label: '3-Month Treasury', series_id: 'DGS3MO' },
      { label: '2-Year Treasury', series_id: 'DGS2' },
      { label: '5-Year Treasury', series_id: 'DGS5' },
      { label: '10-Year Treasury', series_id: 'DGS10' },
      { label: '30-Year Treasury', series_id: 'DGS30' },
      { label: '30-Year Mortgage', series_id: 'MORTGAGE30US' },
    ];

    const fetchPromises = yields.map(async (yieldData) => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${yieldData.series_id}&api_key=${apiKey}&file_type=json`;
      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`FRED API error for ${yieldData.label}: ${response.statusText}`);
      }

      const data = await response.json();
      const latestObservation = data.observations?.findLast((obs) => obs.value !== '.');

      return {
        label: yieldData.label,
        rate: latestObservation?.value || 'N/A',
        date: latestObservation?.date || 'Unknown',
      };
    });

    const results = await Promise.all(fetchPromises);

    return NextResponse.json({ yields: results });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch treasury yields' }, { status: 500 });
  }
}
