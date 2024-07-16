"use client"
import FormDocument from "@/components/FormDocumentPreview";


export default function preview() {
  return ( 
      <div>
        <FormDocument preview={true} />
      </div>
  );
}
