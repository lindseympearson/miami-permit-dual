import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(req: Request) {
  const data = await req.json();
  const templatePath = data.jurisdiction === "city" 
    ? "/city-permit-datasheet-template.pdf" 
    : "/county-building-permit-template.pdf";

  // Fetch the template from the public folder
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : "http://localhost:3000";
  const templateBytes = await fetch(`${baseUrl}${templatePath}`).then(r => r.arrayBuffer());
  
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

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
  return new NextResponse(pdfBytes, {
    headers: { "Content-Type": "application/pdf" },
  });
}
