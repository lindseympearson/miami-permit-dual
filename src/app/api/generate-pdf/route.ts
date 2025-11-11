import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';

// Replace this with your actual form data type
interface FormData {
  folio?: string;
  // Add other fields as needed
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    const data: FormData = await request.json();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // Add title
    page.drawText('Miami Permit Application', {
      x: 50,
      y: height - 100,
      size: 24,
      color: rgb(0, 0.3, 0.6),
    });

    // Add folio number
    page.drawText(`Folio: ${data.folio || 'N/A'}`, {
      x: 50,
      y: height - 150,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Add placeholder content
    page.drawText('This is a generated permit PDF.', {
      x: 50,
      y: height - 200,
      size: 14,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Finalize PDF
    const pdfBytes = await pdfDoc.save();

    // Convert to Buffer (required for NextResponse in API routes)
    const pdfBuffer = Buffer.from(pdfBytes.buffer);

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Miami_Permit_${data.folio || 'filled'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
