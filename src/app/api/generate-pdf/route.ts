import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const templateUrl = data.jurisdiction === "city"
      ? "https://www.miami.gov/files/sharedassets/public/v/1/building/legacy-permitapplication-1.pdf"
      : "https://www.miamidade.gov/permits/library/building-permit.pdf";

    const response = await fetch(templateUrl);
    if (!response.ok) throw new Error("Failed to fetch PDF template");

    const templateBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Fill fields
    if (data.jurisdiction === "county") {
      form.getTextField("Job Address")?.setText(data.propertyAddress || "");
      form.getTextField("Folio")?.setText(data.folio || "");
      form.getTextField("Owner")?.setText(data.ownerName || "");
    } else {
      form.getTextField("JobAddress")?.setText(data.propertyAddress || "");
      form.getTextField("FolioNumber")?.setText(data.folio || "");
      form.getTextField("OwnerName")?.setText(data.ownerName || "");
    }

  const pdfBytes = await pdfDoc.save();
return new NextResponse(Buffer.from(pdfBytes.buffer), {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="Miami_Permit_${data.folio || "filled"}.pdf"`,
  },
});
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
