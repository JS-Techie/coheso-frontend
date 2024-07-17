"use client"
import React, { useState } from 'react';
import { useFormStore } from '../stores/formStore';
import { v4 as uuidv4 } from 'uuid';
import {Card, CardHeader, CardBody, CardFooter, Divider, Textarea, Button} from "@nextui-org/react";
import CustomFields from './CustomFields';
import { usePathname, useSearchParams } from 'next/navigation';

import { Field, Option } from '@/interfaces/interfaces.d';

interface CustomField {
  field_id: string;
  field_label: string;
  field_type: string;
  field_value: string;
  submitted: boolean;
  required: boolean;
}

interface Form {
  formId: string;
  version: string;
  formVersionId: string;
  formName: string;
  formDescription: string;
  formOwner: string;
  createdOn: string;
  customFields: CustomField[];
}

const FormBuilder: React.FC<{handleSubmitButton : (data:boolean) => void}> = ({handleSubmitButton}) => {
  const pagePathName = usePathname();
  const searchParams = useSearchParams();
  const pageStatus = searchParams.get('status') === 'Edit' ? 'edit': searchParams.get('status') === 'versionadd'? 'version': 'create'; 
  const savedForm = useFormStore(state => state.form);
  const previewForm = useFormStore((state: any) => state.previewForm);
  const [customFieldComponent, setCustomFieldComponent] = useState<number[]>([]);
  const [formData, setFormData] = useState<Form>(()=> {
    if (pageStatus == 'create'){
      return {
        formId: `form--${uuidv4()}`,
        version: '',
        formVersionId: '',
        formName: '',
        formDescription: '',
        formOwner: '',
        createdOn: new Date().toString(),
        customFields: []
      }
    }
    else if (pageStatus == 'edit'){
      let customFieldArray: CustomField[] = []
      let customFieldComponentArray: number[] = []
      savedForm.fields.map((eachField: Field, index:number)=>{
          const customFieldJson = {
          field_id: eachField.field_id,
          field_label: eachField.field_label,
          field_type: eachField.field_type,
          field_value:'',
          required: eachField.required,
          submitted: true
        }
        if (eachField.field_type === 'single-select' || eachField.field_type === 'multi-file'){
          customFieldJson['field_value'] = JSON.stringify(eachField.options)
        }
        else if (eachField.field_type == 'text' || eachField.field_type == 'long-text' || eachField.field_type == 'date'){
          customFieldJson['field_value'] = eachField.placeholder || ''
        }
        customFieldComponentArray.push(index+1)
      customFieldArray.push(customFieldJson)
      }
    )
    setCustomFieldComponent(customFieldComponentArray)
      return {
        formId: savedForm.form_id,
        version: savedForm.version,
        formVersionId: savedForm.form_version_id,
        formName: savedForm.form_name,
        formDescription: savedForm.form_description,
        formOwner: savedForm.form_owner,
        createdOn: savedForm.created_on,
        customFields: customFieldArray
      }
    }
    else{
      return {
        formId: savedForm.form_id,
        version: '',
        formVersionId: '',
        formName: '',
        formDescription: '',
        formOwner: '',
        createdOn: new Date().toString(),
        customFields: []
      }
    }
  });

  console.log('FORM DATA ::::: ', formData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Form) => {
    handleSubmitButton(true);
    if (field == 'version'){
      setFormData({
        ...formData,
        'version': e.target.value,
        'formVersionId':`${formData.formId}--${e.target.value}`
      });
    }
    else{
      setFormData({
        ...formData,
        [field]: e.target.value
      });
    }

  };

  const handleCustomFieldChange = (index: number, fieldData: CustomField) => {
    handleSubmitButton(true);
    const updatedFields = [...formData.customFields];
    updatedFields[index] = fieldData;
    setFormData(prevState => ({ ...prevState, customFields: updatedFields }));
  };

  const addCustomComponent = () => {
    setCustomFieldComponent([...customFieldComponent, customFieldComponent.length]);  
    setFormData({
      ...formData,
      customFields: [...formData.customFields, { field_id: `field--${uuidv4()}`, field_label: '', field_type: '', field_value: '', submitted: false, required: false }]
    });
  };

  const removeCustomComponent = (index: number) => {
    setCustomFieldComponent(customFieldComponent.filter((_, i) => i !== index));
    setFormData({
      ...formData,
      customFields: formData.customFields.filter((_, i) => i !== index)
    });
  };

  const handleStoreDataSubmit = async() => {
    handleSubmitButton(false);
    let fields : any = [];
    if (formData.customFields.length > 0){
      formData.customFields.map((eachCustomField) => {
        let fieldDataJson = {
          field_id: eachCustomField.field_id,
          field_label: eachCustomField.field_label,
          field_type: eachCustomField.field_type,
          required: eachCustomField.required
        }
        if (eachCustomField.field_type === 'single-select' || eachCustomField.field_type === 'multi-file') (fieldDataJson as any)['options'] = JSON.parse(eachCustomField.field_value)
        else (fieldDataJson as any)['placeholder'] = eachCustomField.field_value
        fields.push(fieldDataJson)
      })
    }
    const preparedFormData = {
      form_id: formData.formId,
      version: formData.version,
      form_version_id: formData.formVersionId,
      form_name: formData.formName,
      form_description: formData.formDescription,
      form_owner: formData.formOwner,
      created_on: formData.createdOn,
      fields: fields
    };
    console.log('Submitted Data:', JSON.stringify(preparedFormData));
    previewForm(preparedFormData);
  };

  return (
    <div className='flex justify-center'>
    <Card className="py-4 w-[90%]">
      <CardHeader className="mb-6 ml-6">  
      <p className="text-2xl font-bold">
        Form
      </p>
      </CardHeader>
      <Divider className='bg-black h-[2px]'/>
      <CardBody>
      <div className="grid grid-cols-12 gap-4 justify-between items-center p-4">
        <div className="text-right col-span-3">
          Form ID :
        </div>
        <div className="text-left col-span-8">
          <Textarea isRequired isDisabled placeholder={formData.formId} minRows={1} size='sm'/>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-12 gap-4 justify-between p-4">
        <div className="text-right col-span-3">
          Version :
        </div>
        <div className="text-left col-span-8">
          <Textarea isRequired placeholder="Enter Version ID " minRows={1} size='sm' value={formData.version} onChange={(e) => handleChange(e, 'version')}/>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-12 gap-4 justify-between p-4">
        <div className="text-right col-span-3">
          Form Version ID :
        </div>
        <div className="text-left col-span-8">
          <Textarea isRequired isDisabled placeholder={formData.formVersionId ? formData.formVersionId : '-'} minRows={1} size='sm'/>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-12 gap-4 justify-between p-4">
        <div className="text-right col-span-3">
          Form Name :
        </div>
        <div className="text-left col-span-8">
          <Textarea isRequired placeholder="Enter Form Name " minRows={1} size='sm' value={formData.formName} onChange={(e) => handleChange(e, 'formName')}/>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-12 gap-4 justify-between p-4">
        <div className="text-right col-span-3">
          Form Description :
        </div>
        <div className="text-left col-span-8">
          <Textarea isRequired placeholder="Enter Description " minRows={3} size='sm' value={formData.formDescription} onChange={(e) => handleChange(e, 'formDescription')}/>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-12 gap-4 justify-between p-4">
        <div className="text-right col-span-3">
          Form Owner :
        </div>
        <div className="text-left col-span-8">
          <Textarea isRequired placeholder="Enter The Form Owner " minRows={1} size='sm' value={formData.formOwner} onChange={(e) => handleChange(e, 'formOwner')}/>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-12 gap-4 justify-between p-4">
        <div className="text-right col-span-3 pt-3">
          Custom Fields :
        </div>
        <div className="text-left col-span-8">
          {customFieldComponent.map((field, index) => (
            <div key={index} className="flex items-center mb-2">
              <CustomFields index={index} fieldData={formData.customFields[index]} handleCustomFieldChange={handleCustomFieldChange} />
              <Button color="warning" onClick={() => removeCustomComponent(index)} className="ml-2">
                Delete
              </Button>
            </div>
          ))}
          <Button onClick={addCustomComponent} className="mt-2 w-full">
            Add Field
          </Button>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-12 gap-4 justify-between p-4">
        <div className="text-right col-span-3 pt-3">
          Created On :
        </div>
        <div className="text-left col-span-8">
          <Textarea isRequired isDisabled placeholder={new Date(formData.createdOn).toLocaleString()} minRows={1} size='sm'/>
        </div>
      </div>
      </CardBody>
      <CardFooter>
        <div className="flex justify-end items-center w-full p-2">
          <div className="space-x-2">
            <Button onClick={()=>{setFormData({
                      formId: `form--${uuidv4()}`,
                      version: '',
                      formVersionId: '',
                      formName: '',
                      formDescription: '',
                      formOwner: '',
                      createdOn: new Date().toString(),
                      customFields: []
                    }); 
                    setCustomFieldComponent([]);
                }}>Clear</Button>
            <Button onClick={handleStoreDataSubmit}>Preview {'>'}</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
    </div>
  );
};

export default FormBuilder;
