import Form from "@/components/Form";
import { NextUIProvider } from "@nextui-org/react";
import TableComponent from "@/components/TableComponent";
import FormDocument from "@/components/FormDocumentPreview";

export default function Home() {
  return ( 
      <div>
        {/* <Form /> */}
        {/* <CardNavigationMenu /> */}
        <FormDocument preview={true}/>
      </div>
  );
}
