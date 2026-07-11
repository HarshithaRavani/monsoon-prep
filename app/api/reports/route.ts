import { NextRequest } from 'next/server';
import { getCommunityReports } from '@/services/monsoonService';

const reports = [] as Array<{
  id: string;
  type: string;
  location: string;
  description: string;
  confidence: number;
  verified: boolean;
}>;

export async function GET() {
  const liveReports = await getCommunityReports();
  return Response.json(liveReports);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const newReport = {
    id: `report-${Date.now()}`,
    ...payload,
    confidence: payload.confidence ?? 60,
    verified: false,
  };

  reports.push(newReport);
  return Response.json(newReport, { status: 201 });
}
