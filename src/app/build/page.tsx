"use client"
import FormBuilder from "@/components/Form";
import FormDocument from "@/components/FormDocumentPreview";
import { Button } from "@nextui-org/react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSearchParams } from "next/navigation";

import { createForms, updateForm } from "@/api/form";
import { useFormStore } from "@/stores/formStore";
import { stat } from "fs";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Formbuilder() {
  const params = useSearchParams();
  const status = params.get('status') === 'Edit' ? 'edit' : 'create'
  const savedForm = useFormStore(state => state.form)
  const [ disableSubmitButton, setDisableSubmitButton ] = useState(true);

  const handleFormSubmit = async() => {
    if (
      savedForm.fields.length === 0  ||
      savedForm.form_description=== "" ||
      savedForm.form_name=== "" ||
      savedForm.form_owner=== "" ||
      savedForm.form_version_id=== "" ||
      savedForm.version=== ""
    ) toast.error("Please Fill Out All The Fiels Properly and Have At Least One Custom Field")
    else {
      const submitFormResponse = status === 'edit' ? await updateForm(savedForm, savedForm.form_version_id) : await createForms([savedForm])
      if (submitFormResponse && submitFormResponse.data){
        status === 'edit' ? toast.success("Doccument Edited Successfully") : toast.success("Document Submiited Successfully");
        setDisableSubmitButton(true);
      }
    }
  }

  const handleDisablingSubmitButton = (data: boolean) => {
    setDisableSubmitButton(data);
  }
  return ( 
    <div className="overflow-y-clip h-[100vh]">
      <div className="absolute left-[90%] z-9 pt-5">
        <Button isDisabled={disableSubmitButton} variant="faded" size="lg" className="font-medium" onClick={handleFormSubmit}>SUBMIT {'>'}</Button>
      </div>
      <div className="grid grid-cols-2 h-screen">
        <div className="col-span-1 overflow-y-scroll h-full justify-center pt-5" style={{scrollbarWidth:'none'}}>
          <FormBuilder handleSubmitButton={handleDisablingSubmitButton}/>
        </div>
        <div className="col-span-1 overflow-y-auto h-full justify-center pt-5" style={{scrollbarWidth:'none'}}>
          <FormDocument preview={true}/>
        </div>
      </div>
    </div>
  
  );
}
