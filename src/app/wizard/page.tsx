'use client';

import { useState } from "react";

export default function Wizard() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    folio: "",
    propertyAddress: "",
    ownerName: "",
    jurisdiction: "county"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Miami Permit Wizard</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label className="block text-lg font-medium mb-2">Folio # (13 digits)</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="0130123456789"
            value={formData.folio}
            onChange={(e) => setFormData({...formData, folio: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Property Address</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="123 Main St, Miami, FL"
            value={formData.propertyAddress}
            onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Owner Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="John Doe"
            value={formData.ownerName}
            onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Jurisdiction</label>
          <select
            className="w-full px-4 py-3 border rounded-lg"
            value={formData.jurisdiction}
            onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
          >
            <option value="county">Miami-Dade County</option>
            <option value="city">City of Miami</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700">
          Generate Permit Package
        </button>
      </form>
      {pdfUrl && (
        <div className="mt-8 text-center">
          <a
            href={pdfUrl}
            download={`Miami_Permit_${formData.folio}.pdf`}
            className="inline-block bg-green-600 text-white px-12 py-6 rounded-lg text-2xl font-bold hover:bg-green-700"
          >
            DOWNLOAD YOUR FILLED PERMIT PDF
          </a>
        </div>
      )}
    </div>
  );
}
