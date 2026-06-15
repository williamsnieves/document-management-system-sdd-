import { NextResponse } from 'next/server';

import { getDashboardOverview } from '@/lib/dashboard/overview';

export async function GET() {
  const overview = getDashboardOverview();
  const { metrics, statusDate } = overview;

  const lines = [
    'Organizational Overview Report',
    `Status as of ${statusDate}`,
    '',
    `Total Documents: ${metrics.totalDocuments.value} (${metrics.totalDocuments.delta})`,
    `Pending Approvals: ${metrics.pendingApprovals.value}`,
    `Cloud Storage: ${metrics.storage.usedLabel} of ${metrics.storage.totalLabel} (${metrics.storage.percentUsed}%)`,
  ];

  const pdfStub = `%PDF-1.4 stub\n${lines.join('\n')}`;

  return new NextResponse(pdfStub, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="organizational-overview.pdf"',
    },
  });
}
