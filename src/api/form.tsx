import { Api } from '@mui/icons-material'
import ApiUrl from './api.json'
import toast from 'react-hot-toast'
import { Form } from '@/interfaces/interfaces.d'

export const getAllForms = async() => {
    try{
        const allFormsResponse = await fetch(ApiUrl.form,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        if (!allFormsResponse.ok)
            throw new Error(`Error! status: ${allFormsResponse.status}`);
  
        const allForms = await allFormsResponse.json();
        return allForms;
    }
    catch(error){
        toast.error("ERROR WHILE FETCHING ALL FORMS")
    }
}

export const getAllLatestForms = async() => {
    try{
        const allFormsResponse = await fetch(ApiUrl.latestForms,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        if (!allFormsResponse.ok)
            throw new Error(`Error! status: ${allFormsResponse.status}`);
  
        const allForms = await allFormsResponse.json();
        return allForms;
    }
    catch(error){
        toast.error("ERROR WHILE FETCHING ALL FORMS")
    }
}

export const getSpecificForm = async(formId: string) => {
    try{
        const specificFormResponse = await fetch(ApiUrl.form+'/'+formId,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        if (!specificFormResponse.ok)
            throw new Error(`Error! status: ${specificFormResponse.status}`);

        const specificForm = await specificFormResponse.json();
        return specificForm;
            
    }
    catch(error){
        toast.error("ERROR WHILE FETCHING A FORM")
    }
}

export const getVersionedForms = async(form_id: string) => {
    try{
        const versionedFormResponse = await fetch(ApiUrl.formVersionedFetch+'/'+form_id,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        if (!versionedFormResponse.ok)
            throw new Error(`Error! status: ${versionedFormResponse.status}`);

        const versionedForms = await versionedFormResponse.json();
        return versionedForms;
            
    }
    catch(error){
        toast.error("ERROR WHILE FETCHING VERSIONED FORMs")
    }
}


export const createForms = async(forms: Form[]) => {
    try{
        const createFormResponse = await fetch(ApiUrl.form,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(forms),
            }
        )

        if (!createFormResponse.ok)
            throw new Error(`Error! status: ${createFormResponse.status}`);

        const createdForm = await createFormResponse.json();
        return createdForm;
            
    }
    catch(error){
        toast.error("ERROR WHILE CREATING A FORM")
    }
}


export const updateForm = async(form: Form, formVersionId: string) => {
    try{
        const updateFormResponse = await fetch(ApiUrl.form+'/'+formVersionId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            }
        )

        if (!updateFormResponse.ok)
            throw new Error(`Error! status: ${updateFormResponse.status}`);

        const updatedForm = await updateFormResponse.json();
        return updatedForm;
            
    }
    catch(error){
        toast.error("ERROR WHILE UPDATING A FORM")
    }
}



export const deleteForm = async(formVersionId: string) => {
    try{
        const deleteFormResponse = await fetch(ApiUrl.form+'/'+formVersionId,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!deleteFormResponse.ok)
            throw new Error(`Error! status: ${deleteFormResponse.status}`);

        const deletedForm = await deleteFormResponse.json();
        return deletedForm;
            
    }
    catch(error){
        toast.error("ERROR WHILE DELETING A FORM")
    }
}

