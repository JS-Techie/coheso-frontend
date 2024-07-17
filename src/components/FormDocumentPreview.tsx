"use client"
import { Button, Card, Divider } from '@nextui-org/react';
import { Form, Submission, Option } from '@/interfaces/interfaces.d';
import { v4 as uuidv4 } from 'uuid';
import { useFormStore } from '@/stores/formStore';
import { ReactEventHandler, useEffect, useState } from 'react';
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

  const handleSubmitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubmitForm(prevForm => {
        const updatedData = [...prevForm.data];
        const fieldIndex = updatedData.findIndex(item => item.field_id === name);

        if (fieldIndex > -1) {
            // If field exists, update its value
            updatedData[fieldIndex] = {
                ...updatedData[fieldIndex],
                value: [value],
            };
        } else {
            // If field doesn't exist, add new field
            updatedData.push({
                field_id: name,
                value: [value],
            });
        }

        return {
            ...prevForm,
            data: updatedData,
        };
    });
};

  const handleFormSubmit = async() => {
    const submissionData = status === 'edit' ? await updateSubmission(submitForm, submitForm.submission_id) : await createSubmission(submitForm)
    console.log("success creation submit-",submissionData)
    if (submissionData)
      status === 'edit' ? toast.success("Document Edited Successfully") : toast.success("Docment Submitted Successfully")
    setPreviewKey(true)
    previewSubmission(submissionData) 
  }

  const getFieldValue = (fieldId: string): string => {
    const field = submitForm.data.find((f) => f.field_id === fieldId);
    return field ? field.value[0] : '';
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{formData.form_name}</h1>
            <p className="text-lg text-justify pt-10">{formData.form_description}</p>
          </div>

          <div className="mb-8">
            <p className="mb-2"><strong>Form Owner:</strong> {formData.form_owner}</p>
            <p className="mb-2" suppressHydrationWarning><strong>Created On:</strong> {new Date(formData.created_on).toLocaleString()}</p>
          </div>

          <Divider className="my-8" />

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
            <p className="mb-2" suppressHydrationWarning><strong>Created On:</strong> {new Date(formData.created_on).toLocaleString()}</p>
          </div>

          <Divider className="my-8" />

          <div className="space-y-6">
            {chunk.map((field: any) => (
              <div key={field.field_id} className="border-b border-gray-300 pb-4">
                <p className="font-semibold text-lg">{field.field_label}{field.required ? ' *' : ''}</p>
                {field.field_type === 'text' || field.field_type === 'long-text' ? (
                  <input
                    disabled={previewKey}
                    type="text"
                    name={field.field_id}
                    value={getFieldValue(field.field_id)}
                    placeholder={field.placeholder}
                    onChange={handleSubmitChange}
                    className="w-full border-none rounded-md p-2"
                  />
                ) : (field.field_type === 'single-select' && field.options != undefined) ? (
                  <div className="flex flex-col space-y-2 pt-3">
                    {field.options.map((option: Option) => (
                      <div key={option.key} className="flex items-center pt-2">
                        <input key={option.key} value={option.key} checked={getFieldValue(field.field_id) === option.key} disabled={previewKey} type="radio" name={field.field_id} onChange={handleSubmitChange} className="mr-2" />
                        <span>{option.key} <span className="text-sm text-gray-500">({option.value})</span></span>
                      </div>
                    ))}
                  </div>
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
