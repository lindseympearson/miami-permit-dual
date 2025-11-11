'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const schema = z.object({
  folio: z.string().length(13, "Folio must be 13 digits"),
  propertyAddress: z.string().min(5),
  ownerName: z.string(),
  projectType: z.enum(["ADU", "Addition", "Pool", "Commercial TI", "New Construction"]),
  jurisdiction: z.enum(["county", "city"]),
});

export default function Wizard() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { jurisdiction: "county" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Miami Permit Wizard (County + City)</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField control={form.control} name="folio" render={({ field }) => (
            <FormItem><FormLabel>Folio # (13 digits)</FormLabel><FormControl><Input placeholder="0130123456789" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="propertyAddress" render={({ field }) => (
            <FormItem><FormLabel>Property Address</FormLabel><FormControl><Input placeholder="123 Main St, Miami, FL 33130" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="ownerName" render={({ field }) => (
            <FormItem><FormLabel>Owner Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="jurisdiction" render={({ field }) => (
            <FormItem>
              <FormLabel>Jurisdiction</FormLabel>
              <select {...field} className="w-full border rounded p-2">
                <option value="county">Miami-Dade County</option>
                <option value="city">City of Miami</option>
              </select>
            </FormItem>
          )} />
          <Button type="submit">Generate Permit Package</Button>
        </form>
      </Form>
      {pdfUrl && (
        <div className="mt-8">
          <a href={pdfUrl} download={`Miami_Permit_${form.getValues().folio}.pdf`} className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg">
            DOWNLOAD YOUR FILLED PERMIT PDF
          </a>
        </div>
      )}
    </div>
  );
}
