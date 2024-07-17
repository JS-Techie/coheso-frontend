"use client"
import React, { useEffect, useState } from 'react';
import { useFormStore } from '../../stores/formStore';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, getKeyValue, Spinner, Card, CardBody, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

import TableComponent from '@/components/TableComponent';
import { EyeIcon } from '@/components/EyeIcon';
import { DeleteIcon } from '@/components/DeleteIcon';
import { EditIcon } from '@/components/EditIcon';
import { getAllSubmissionsForSpecificFormVersionId, deleteSubmission } from '@/api/submission';
import { Submission } from '@/interfaces/interfaces.d';
import toast from 'react-hot-toast';


const Submissions: React.FC = () => {
  const params = useSearchParams()
  const [specificSubmissions, setSpecificSubmissions] = useState<Submission[]>([]);
  const previewSubmission = useFormStore(state => state.previewSubmission);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [actionSubmission, setActionSubmission] = useState({'submission_id':'', 'createdOn':''});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(()=>{
    const specificSubmissionsApiCall = async() => {
      const formVersionId = params.get('form_version_id') ?? '';
      const specificSubmissionsResponse = await getAllSubmissionsForSpecificFormVersionId(formVersionId);
      console.log("speicific submission::: ", specificSubmissionsResponse)
      setSpecificSubmissions(specificSubmissionsResponse)
    }
    specificSubmissionsApiCall()
  },[refreshKey])
  console.log(specificSubmissions)


  function modalComp() {
    return (
      <>
        <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  Delete Form Submission {actionSubmission.submission_id} created On {actionSubmission.createdOn} ?
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
                                                              const deleteFormResponse = await deleteSubmission(actionSubmission.submission_id)
                                                              console.log("THE DELETE RESPONSE ::: ", deleteFormResponse);
                                                              setRefreshKey(prevState => prevState+1)
                                                              onClose();
                                                              toast.error("Document Deleted Successfully");
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



  const ActionsComponent=({submissionData} : { submissionData: Submission })=>{
    return(
      <>
        <div className="flex justify-center items-center">
            <Tooltip content="View" className='px-1 rounded-sm'>
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50 ml-10" onClick={() => previewSubmission(submissionData)}>
                  <Link href='/preview'>
                    <EyeIcon />
                    </Link>
                </span>
            </Tooltip>
            <Tooltip content="Edit" color='primary' className='px-1 rounded-sm'>
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50 ml-10" onClick={() => previewSubmission(submissionData)}>
                  <Link href={{pathname:'/preview', query:{'status':'edit'}}}>
                    <EditIcon />
                  </Link>
                </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete" className='px-1 rounded-sm'>
                <span className="text-lg text-danger cursor-pointer active:opacity-50 ml-10" onClick={()=>{onOpen(); setActionSubmission(submissionData)}}>
                    <DeleteIcon />
                </span>
            </Tooltip>
        </div>
      </>
    )
  }

  const columns = [
      {
        key:"submission_id",
        label: "Submission ID"
      },
      {
        key:"createdOn",
        label:"Date Created on"
      },
      {
        key:"actions",
        label:"Actions"
      }
    ]

  const rowsWithActions = specificSubmissions.map((submission) => ({
    ...submission,
    actions: <ActionsComponent submissionData={submission} />
  }));
      
  return ( 
      <div key={refreshKey}>
        {modalComp()}
        <TableComponent rows={rowsWithActions} columns={columns} filterKeys={['createdOn']}/>
      </div>
  );
};
export default Submissions;
