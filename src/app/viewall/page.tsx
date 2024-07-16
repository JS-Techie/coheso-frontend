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
import { getTotalSubmissions } from '@/api/submission';
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
  const [totalSubmissions, setTotalSubmissions] = useState< {
    success: boolean;
    data: {[key:string]:number;};
    clientMessage: string;
    devMessage: string;
  }>({
    success: false,
    data: {},
    clientMessage: '',
    devMessage: ''
  });
  const previewSubmission = useFormStore((state) => state.previewSubmission);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [actionForm, setActionForm] = useState({'form_name':'', 'form_id':'', 'form_version_id':''});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const getAllFormsResponse: ApiResponse = await getAllForms();
        setAllForms(getAllFormsResponse);
        const getTotalSubmissionsResponse = await getTotalSubmissions();
        console.log("THE RESPONSE",getTotalSubmissionsResponse.data)
        setTotalSubmissions(getTotalSubmissionsResponse)
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchAllForms();
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
        <Tooltip showArrow={true} content="View" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50 ml-8">
            <Link href='/preview'>
              <div onClick={()=> previewStore(form)}>
                <EyeIcon />
              </div>
            </Link>
          </span>
        </Tooltip>
        <Tooltip color='warning' showArrow={true} content="Edit" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50 ml-8">
            <Link href={{pathname:'/build', query:{status:'Edit'}}}>
                <div onClick={()=> previewStore(form)}>
                  <EditIcon />
                </div>
              </Link>
          </span>
        </Tooltip>
        <Tooltip color="danger" showArrow={true} content="Delete" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-danger cursor-pointer active:opacity-50 ml-8" onClick={()=>{onOpen(); setActionForm(form)}}>
            <DeleteIcon />
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
              <img src={FormSubmitIcon.src} alt="Submit form" width={'35px'} />
            </Link>
          </span>          
        </Tooltip>
        <Tooltip color="primary" showArrow={true} content="View Submissions" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-danger cursor-pointer active:opacity-50 ml-8" onClick={()=> previewStore(form)}>
            <Link href={{pathname:'/submissions', query:{'form_version_id' : form.form_version_id}}}>
              <img src={SubmissionsIcon.src} alt="Submit form" width={'40px'} />
            </Link>
          </span>          
        </Tooltip>
        <Tooltip color="foreground" showArrow={true} content="View All Versions" className='py-1 px-1 rounded-sm'>
          <span className="text-lg text-danger cursor-pointer active:opacity-50 ml-8" onClick={()=> previewStore(form)}>
            <Link href={{pathname:'/versions', query:{'form_id' : form.form_id}}}>
              <img src={VersionAllIcon.src} alt="Version" width={'50px'} />
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
    { key: "total_submissions", label:'Total Submissions'},
    { key: "actions", label: "Actions" },
    
  ];

  const rowsWithActions = allForms.data.map((form: Form) => {
    const totalSubmissionsCount = totalSubmissions.data[form.form_version_id] || 0;
  
    return {
      ...form,
      actions: <ActionsComponent form={form} />,
      total_submissions: totalSubmissionsCount
    };
  });
  

  return (
    <div>
      {modalComp()}
      <TableComponent rows={rowsWithActions} columns={columns} filterKeys={['form_name', 'form_description']}/>
    </div>
  );
};

export default ViewAll;
