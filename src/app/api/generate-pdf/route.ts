import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // Add content
    page.drawText('Miami Permit Application', {
      x: 50,
      y: height - 100,
      size: 24,
      color: rgb(0, 0.3, 0.6),
    });
    page.drawText(`Folio: ${data.folio || 'N/A'}`, {
      x: 50,
      y: height - 150,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Save PDF to buffer
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes); // Simpler, TypeScript-safe

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Miami_Permit_${data.folio || 'filled'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
