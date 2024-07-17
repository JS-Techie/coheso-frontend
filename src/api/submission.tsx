import ApiUrl from './api.json'
import { Submission } from '@/interfaces/interfaces.d'
import toast from 'react-hot-toast';

export const getAllSubmissions = async () => {
    try {
        const allSubmissionsResponse = await fetch(ApiUrl.submission, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!allSubmissionsResponse.ok)
            throw new Error(`Error! status: ${allSubmissionsResponse.status}`);

        const allSubmissions = await allSubmissionsResponse.json();
        return allSubmissions;
    } catch (error) {
        toast.error("ERROR WHILE FETCHING ALL SUBMISSIONS");
    }
}

export const getSpecificSubmission = async (submissionId: string) => {
    try {
        const specificSubmissionResponse = await fetch(ApiUrl.submission + '/' + submissionId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!specificSubmissionResponse.ok)
            throw new Error(`Error! status: ${specificSubmissionResponse.status}`);

        const specificSubmission = await specificSubmissionResponse.json();
        return specificSubmission;
    } catch (error) {
        toast.error("ERROR WHILE FETCHING A SUBMISSION");
    }
}

export const getTotalSubmissions = async () => {
    try {
        const TotalSubmissionResponse = await fetch(ApiUrl.total_submissions, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!TotalSubmissionResponse.ok)
            throw new Error(`Error! status: ${TotalSubmissionResponse.status}`);

        const TotalSubmissions = await TotalSubmissionResponse.json();
        return TotalSubmissions;
    } catch (error) {
        toast.error("ERROR WHILE FETCHING TOTAL SUBMISSIONS");
    }
}

export const getAllSubmissionsForSpecificFormVersionId = async (form_version_id: string) => {
    try {
        const AllSubmissionResponse = await fetch(ApiUrl.all_submissions+'/'+form_version_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!AllSubmissionResponse.ok)
            throw new Error(`Error! status: ${AllSubmissionResponse.status}`);

        const allSubmissions = await AllSubmissionResponse.json();
        return allSubmissions.data;
    } catch (error) {
        toast.error("ERROR WHILE FETCHING TOTAL SUBMISSIONS");
    }
}


export const createSubmission = async (submissionData: Submission) => {
    try {
        const createSubmissionResponse = await fetch(ApiUrl.submission, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });

        if (!createSubmissionResponse.ok)
            throw new Error(`Error! status: ${createSubmissionResponse.status}`);

        const createdSubmission = await createSubmissionResponse.json();
        return createdSubmission.data;
    } catch (error) {
        toast.error("ERROR WHILE CREATING A SUBMISSION");
    }
}

export const updateSubmission = async (submissionData: Submission, submissionId: string) => {
    try {
        const updateSubmissionResponse = await fetch(ApiUrl.submission + '/' + submissionId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });

        if (!updateSubmissionResponse.ok)
            throw new Error(`Error! status: ${updateSubmissionResponse.status}`);

        const updatedSubmission = await updateSubmissionResponse.json();
        return updatedSubmission.data;
    } catch (error) {
        toast.error("ERROR WHILE UPDATING A SUBMISSION");
    }
}

export const deleteSubmission = async (submissionId: string) => {
    try {
        const deleteSubmissionResponse = await fetch(ApiUrl.submission + '/' + submissionId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!deleteSubmissionResponse.ok)
            throw new Error(`Error! status: ${deleteSubmissionResponse.status}`);

        const deletedSubmission = await deleteSubmissionResponse.json();
        return deletedSubmission;
    } catch (error) {
        toast.error("ERROR WHILE DELETING A SUBMISSION");
    }
}
