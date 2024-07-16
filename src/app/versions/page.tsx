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
import VersionIcon from '../../assets/icons/version.ico'
import { getAllForms } from '@/api/form';
import { useFormStore } from '@/stores/formStore';
import { Form } from '@/interfaces/interfaces.d';
import { getVersionedForms, deleteForm } from '@/api/form';
import { useSearchParams } from 'next/navigation';

interface ApiResponse {
  success: boolean;
  data: Form[];
  clientMessage: string;
  devMessage: string;
}


const VersionAll: React.FC = () => {
  const [versionedForms, setVersionedForms] = useState<ApiResponse>({
    success: false,
    data: [],
    clientMessage: '',
    devMessage: ''
  });
  const params = useSearchParams();
  const formIdFromParam = params.get('form_id') ?? '';
  const previewStore = useFormStore((state) => state.previewForm);
  const previewSubmission = useFormStore((state) => state.previewSubmission);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [actionForm, setActionForm] = useState({'form_name':'', 'form_id':'', 'form_version_id': ''});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchVersionedForms = async () => {
      try {
        const getVersionedFormsResponse: ApiResponse = await getVersionedForms(formIdFromParam);
        setVersionedForms(getVersionedFormsResponse);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchVersionedForms();
  }, [refreshKey]);

  function modalComp() {
    return (
      <>
        <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  Delete Form {actionForm.form_name} ?
                </ModalHeader>
                <ModalBody>
                  Are You Sure You Want to Delete it ?
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button color="primary" onPress={async()=>{
                                                              const deleteFormResponse = await deleteForm(actionForm.form_version_id)
                                                              console.log("THE DELETE RESPONSE ::: ", deleteFormResponse);
                                                              setRefreshKey(prevState => prevState+1)
                                                              onClose();
                                                              }}>
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  const ActionsComponent: React.FC<{form: Form}> = ({form}) => {
    return (
      <div className="flex justify-center items-center">
        <Tooltip showArrow={true} content="View Version" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50 ml-10">
            <Link href='/preview'>
              <div onClick={()=> previewStore(form)}>
                <EyeIcon />
              </div>
            </Link>
          </span>
        </Tooltip>
        <Tooltip color="danger" showArrow={true} content="Delete" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-danger cursor-pointer active:opacity-50 ml-10" onClick={()=>{onOpen(); setActionForm(form)}}>
            <DeleteIcon />
          </span>
        </Tooltip>
        <Tooltip color="foreground" showArrow={true} content="Add Version" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-danger cursor-pointer active:opacity-50 ml-10" onClick={()=> previewStore(form)}>
            <Link href={{pathname:'/build', query:{'status' : 'versionadd'}}}>
              <img src={VersionIcon.src} alt="Version" width={'30px'} />
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

  const rowsWithActions = versionedForms.data.map((form) => ({
    ...form,
    actions: <ActionsComponent form={form} />
  }));

  return (
    <div>
      {modalComp()}
      <TableComponent rows={rowsWithActions} columns={columns} filterKeys={['form_name', 'form_description']}/>
    </div>
  );
};

export default VersionAll;
