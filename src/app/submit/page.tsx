import FormDocument from "@/components/FormDocumentPreview";
import { Button } from "@nextui-org/react";

export default function Home() {
  return ( 
      <div className="grid grid-cols-3">
        <div className="col-start-2 col-span-1">
            <FormDocument preview={false}/>
        </div>
      </div>
  );
}
