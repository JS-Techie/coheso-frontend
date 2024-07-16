"use client"
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import Link from 'next/link';

import TableComponent from '@/components/TableComponent';
import { EyeIcon } from '@/components/EyeIcon';
import { DeleteIcon } from '@/components/DeleteIcon';
import { EditIcon } from '@/components/EditIcon';
import FormSubmitIcon from '../../assets/icons/FormSubmit.ico'
import SubmissionsIcon from '../../assets/icons/Submissions.ico'
import VersionAllIcon from '../../assets/icons/versionAll.ico'
import { getAllForms } from '@/api/form';
import { useFormStore } from '@/stores/formStore';
import { Form } from '@/interfaces/interfaces.d';
import { deleteForm } from '@/api/form';

interface ApiResponse {
  success: boolean;
  data: Form[];
  clientMessage: string;
  devMessage: string;
}


const ViewAll: React.FC = () => {
  const [allForms, setAllForms] = useState<ApiResponse>({
    success: false,
    data: [],
    clientMessage: '',
    devMessage: ''
  });

  const previewStore = useFormStore((state) => state.previewForm);
  const previewSubmission = useFormStore((state) => state.previewSubmission);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [actionForm, setActionForm] = useState({'form_name':'', 'form_id':'', 'form_version_id':''});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const getAllFormsResponse: ApiResponse = await getAllForms();
        setAllForms(getAllFormsResponse);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchAllForms();
  }, [refreshKey]);


  const ActionsComponent: React.FC<{form: Form}> = ({form}) => {
    return (
      <div className="flex justify-center items-center">
        <Tooltip showArrow={true} content="View" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50 ml-8">
            <Link href='/preview'>
              <div onClick={()=> previewStore(form)}>
                <EyeIcon />
              </div>
            </Link>
          </span>
        </Tooltip>
        <Tooltip color="success" showArrow={true} content="Submit A Response" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-danger cursor-pointer active:opacity-50 ml-8" onClick={()=>{previewStore(form); previewSubmission({
                                                                                                                                            submission_id:uuidv4(),
                                                                                                                                            form_version_id:form.form_version_id,
                                                                                                                                            data:[],
                                                                                                                                            createdOn:new Date().toString(),
                                                                                                                                          })}}>
            <Link href={'/submit'}>
              <img src={FormSubmitIcon.src} alt="Submit form" width={'18px'} />
            </Link>
          </span>          
        </Tooltip>
      </div>
    );
  };

  const columns = [
    { key: "form_id", label: "Form ID" },
    { key: "form_name", label: "Form Name" },
    { key: "form_description", label: "Description" },
    { key: "form_owner", label: "Owner" },
    { key: "created_on", label: "Created On" },
    { key: "version", label: "Version" },
    { key: "actions", label: "Actions" }
  ];

  const rowsWithActions = allForms.data.map((form) => ({
    ...form,
    actions: <ActionsComponent form={form} />
  }));

  return (
    <div>
      <TableComponent rows={rowsWithActions} columns={columns} filterKeys={['form_name', 'form_description']}/>
    </div>
  );
};

export default ViewAll;
