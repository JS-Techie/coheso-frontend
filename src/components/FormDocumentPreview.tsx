"use client"
import { Button, Card, Divider, DatePicker, Input, Textarea } from '@nextui-org/react';
import {DateValue, parseDate, getLocalTimeZone} from "@internationalized/date";
import { Form, Submission, Option } from '@/interfaces/interfaces.d';
import { v4 as uuidv4 } from 'uuid';
import { useFormStore } from '@/stores/formStore';
import { useEffect, useState } from 'react';
import { createSubmission, updateSubmission } from '@/api/submission';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Link } from '@nextui-org/react';

const A4_WIDTH = '793.7px';
const A4_HEIGHT = '1122.5px';

const FormDocument: React.FC<{preview: boolean}>= ({preview}) => {
  const params = useSearchParams();
  const formData: Form = useFormStore((state) => state.form);
  const submissionData: Submission = useFormStore((state) => state.submission)
  const previewSubmission = useFormStore((state) => state.previewSubmission)
  const [submitForm, setSubmitForm] = useState<Submission>({
    "submission_id":uuidv4(),
    "form_version_id": formData.form_version_id,
    "data": [],
    "createdOn":new Date().toString(),
  });
  const status = params.get('status');
  const [previewKey, setPreviewKey] = useState(() => status == 'edit' ? false: preview);

  console.log("the submit form ::: ", submitForm.data)

  const splitFieldsIntoChunks = (fields: any, chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < fields.length; i += chunkSize) {
      chunks.push(fields.slice(i, i + chunkSize));
    }

    return chunks;
  };
  useEffect(() => setSubmitForm(submissionData), [submissionData])

  const handleSubmitChange = (e: any, field:any) => {
    let name, value;

    if (field.field_type === 'date') {
      name = field.field_id;
      value = `${e.year}-${e.month.toString().padStart(2, '0')}-${e.day.toString().padStart(2, '0')}`;
    } else if (field.field_type === 'multi-file'){
      name = field.field_id;
      value = [];
      for (let file in e.target.files) {
        if(e.target.files.hasOwnProperty(file)) 
          value.push(e.target.files[file].name)
      }
    }else {
      ({ name, value } = e.target);
    }

    
    setSubmitForm(prevForm => {
        const updatedData = [...prevForm.data];
        const fieldIndex = updatedData.findIndex(item => item.field_id === name);

        if (fieldIndex > -1) {
            updatedData[fieldIndex] = {
                ...updatedData[fieldIndex],
                value: typeof value === 'string' ? [value] : value,
            };
        } else {
            updatedData.push({
                field_id: name,
                value: typeof value === 'string' ? [value] : value,
            });
        }
        return {
            ...prevForm,
            data: updatedData,
        };
    });
};

  const handleFormSubmit = async() => {
    let isSubmissionPermitted : boolean = true;

    for (const field of formData.fields) {
      const matchingField = submitForm.data.find(formField => formField.field_id === field.field_id);
      console.log(matchingField);
      
      if (field.required === true) {
        if (!matchingField || !matchingField.value || matchingField.value.every(v => !v)) {
          isSubmissionPermitted = false;
        }
      }
    }

    if (isSubmissionPermitted){
      const submissionData = status === 'edit' ? await updateSubmission(submitForm, submitForm.submission_id) : await createSubmission(submitForm)
      console.log("success creation submit-",submissionData)
      if (submissionData)
        status === 'edit' ? toast.success("Document Edited Successfully") : toast.success("Document Submitted Successfully")
      setPreviewKey(true)
      previewSubmission(submissionData) 
    } else {
      toast.error("Please Fill Up All the Mandatory fields Properly Before Submission")
    }
  }

  const getFieldValue = (fieldId: string): any => {
    const field = submitForm.data.find((f) => f.field_id === fieldId);
    return field ? field.value.length > 1 ? field.value : field.value[0] : '';
  };

  const chunkSize = 6;
  const fieldChunks = splitFieldsIntoChunks(formData.fields, chunkSize);

  return (
    <div className="min-h-screen flex flex-col items-center space-y-8">
      {formData.fields.length === 0 && (
        <Card
          className="w-full max-w-4xl border border-gray-300"
          style={{ width: A4_WIDTH, height: A4_HEIGHT, pageBreakAfter: 'always', padding: '4%' }}
        >
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold mb-4">{formData.form_name}</h1>
            <p className="text-lg text-justify pt-10">{formData.form_description}</p>
          </div>

          <div className="mb-8">
            <p className="mb-2"><strong>Form Owner:</strong> {formData.form_owner}</p>
            <p className="mb-2" suppressHydrationWarning><strong>Created On:</strong> {new Date(formData.created_on).toLocaleString()}</p>
          </div>

          <Divider className="my-3" />

          <div className="text-right text-sm mt-auto">
            <p>Form ID: {formData.form_id}</p>
            <p>Version ID: {formData.form_version_id}</p>
          </div>
        </Card>
      )}

      {fieldChunks.map((chunk, index) => (
        <Card
          key={index}
          className="w-full max-w-4xl border border-gray-300"
          style={{ width: A4_WIDTH, height: A4_HEIGHT, pageBreakAfter: 'always', padding: '4%' }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{formData.form_name}</h1>
            <p className="text-lg text-justify pt-10">{formData.form_description}</p>
          </div>

          <div className="mb-8">
            <p className="mb-2"><strong>Form Owner:</strong> {formData.form_owner}</p>
            <p className="" suppressHydrationWarning><strong>Created On:</strong> {new Date(formData.created_on).toLocaleString()}</p>
          </div>

          <Divider className="my-8" />

          <div className="space-y-6">
            {chunk.map((field: any) => (
              <div key={field.field_id} className="border-b border-gray-300 pb-2">
                <p className="font-semibold text-lg pb-5">{field.field_label}{field.required ? ' *' : ''}</p>
                {field.field_type === 'text' ? (
                  <input
                    disabled={previewKey}
                    type="text"
                    name={field.field_id}
                    value={getFieldValue(field.field_id)}
                    placeholder={field.placeholder}
                    onChange={(e)=> handleSubmitChange(e, field)}
                    className="w-full border-none rounded-md p-2"
                  />
                ) : field.field_type === 'long-text' ? (
                  <Textarea
                    disabled={previewKey}
                    rows={3}
                    variant='bordered'
                    name={field.field_id}
                    value={getFieldValue(field.field_id)}
                    radius='sm'
                    placeholder={field.placeholder}
                    onChange={(e)=> handleSubmitChange(e, field)}
                    className="w-full border-none rounded-md p-2"
                  />
                ) : (field.field_type === 'date') ? (
                  <div className="flex flex-col space-y-2 pt-3">
                    <DatePicker showMonthAndYearPickers isDisabled={previewKey} key={field.field_id} variant={'underlined'} onChange={(e)=> handleSubmitChange(e, field)} value={getFieldValue(field.field_id) !== '' ? parseDate(getFieldValue(field.field_id)) : parseDate(new Date().toISOString().slice(0, 10).toString())}/>
                  </div>
                ) : (field.field_type === 'single-select' && field.options != undefined) ? (
                  <div className="flex flex-col space-y-2 pt-3">
                    {field.options.map((option: Option) => (
                      <div key={option.key} className="flex items-center pt-2">
                        <input key={option.key} value={option.key} checked={getFieldValue(field.field_id) === option.key} disabled={previewKey} type="radio" name={field.field_id} onChange={(e)=> handleSubmitChange(e, field)} className="mr-2" />
                        <span>{option.key} <span className="text-sm text-gray-500">({option.value})</span></span>
                      </div>
                    ))}
                  </div>
                ) : (field.field_type === 'multi-file') ? (
                    <>
                    {!previewKey &&
                      <input
                        disabled={previewKey}
                        multiple
                        type="file"
                        name={field.field_id}
                        onChange={(e)=> handleSubmitChange(e, field)}
                        className="w-full border-none rounded-md p-2"
                      />
                    }
                      {getFieldValue(field.field_id)?.length>0 && !previewKey && 
                        <div>
                          <p className='font-bold pl-10'>Files Uploaded -</p>
                          <span className='pl-10'/>
                          {
                            typeof getFieldValue(field.field_id) === 'string' ?
                              ( <Button className='px-2 my-3 font-semibold' variant='ghost' size='sm' radius='lg' isDisabled>{getFieldValue(field.field_id)} </Button> )
                              :
                              getFieldValue(field.field_id).map((file: any) => <><Button className='px-2 my-3 font-semibold' variant='ghost' size='sm' radius='lg' isDisabled>{file} </Button><span className='px-2'>|</span></>)
                          }
                        </div>
                      }
                      {getFieldValue(field.field_id)?.length>0 && previewKey && 
                        <div>
                          <p className='font-bold'>Files Uploaded -</p>
                          {
                            typeof getFieldValue(field.field_id) === 'string' ?
                            ( <Button className='px-2 my-3 font-semibold' variant='ghost' size='sm' radius='lg' isDisabled>{getFieldValue(field.field_id)} </Button> ) 
                            :
                            getFieldValue(field.field_id).map((file: any) => <><Button className='px-2 my-3 font-semibold' variant='ghost' size='sm' radius='lg' isDisabled>{file} </Button><span className='px-2'>|</span></>)
                          }
                        </div>
                      }
                    </>
                ) : null}
              </div>
            ))}
          </div>

          {index === fieldChunks.length - 1 && <Divider className="my-8" />}

          {index === fieldChunks.length - 1 && (
            <>
              <div className="text-right text-sm mt-auto">
                <p>Form ID: {formData.form_id}</p>
                <p>Version ID: {formData.form_version_id}</p>
              </div>
              {!previewKey &&
              <div>
                <Button variant='ghost' color='primary' size='lg' radius='sm' className="relative z-10 bottom-[100%]" onClick={handleFormSubmit}>{status == 'edit' ? 'EDIT' : 'SUBMIT'}</Button>
              </div>
              }
              {(preview===false && previewKey===true) &&
              <div>
                <Link className="relative z-10 bottom-[100%]" href='/viewall'>
                  <Button variant='light' color='success' size='lg' radius='sm'>SUBMIT ANOTHER RESPONSE</Button>
                </Link>
              </div>
              }
            </>
          )}
        </Card>
      ))}
    </div>
  );
};

export default FormDocument;
