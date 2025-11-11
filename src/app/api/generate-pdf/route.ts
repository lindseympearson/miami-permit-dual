import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(req: Request) {
  const data = await req.json();

  const templateUrl = data.jurisdiction === "city"
    ? "https://www.miami.gov/files/sharedassets/public/v/1/building/legacy-permitapplication-1.pdf"
    : "https://www.miamidade.gov/permits/library/building-permit.pdf";

  // Fetch the official PDF directly from government sites
  const templateBytes = await fetch(templateUrl).then(res => {
    if (!res.ok) throw new Error("Failed to fetch template");
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Fill fields (field names match real PDFs)
  if (data.jurisdiction === "county") {
    form.getTextField("Job Address")?.setText(data.propertyAddress || "");
    form.getTextField("Folio")?.setText(data.folio || "");
    form.getTextField("Owner")?.setText(data.ownerName || "");
  } else {
    form.getTextField("JobAddress")?.setText(data.propertyAddress || "");
    form.getTextField("FolioNumber")?.setText(data.folio || "");
    form.getTextField("OwnerName")?.setText(data.ownerName || "");
  }

  const pdfBytes = (await pdfDoc.save()).buffer;

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Miami_Permit_${data.folio}.pdf"`,
    },
  });
}
