import create from 'zustand';
import { Form, Submission } from '@/interfaces/interfaces.d';

interface FormState {
  form: Form,
  forms: Form[];
  submission: Submission,
  addForm: (form: Form) => void;
  previewForm: (form: Form) => void;
  previewSubmission: ( submission:Submission ) => void;
}

export const useFormStore = create<FormState>((set) => ({
  form:{
    form_id: 'form--00000000-0000-0000-0000-000000000000',
    version: 'v0',
    form_version_id: 'form--00000000-0000-0000-0000-000000000000-v0',
    form_name: 'Legal Form',
    form_description: 'This is a Legal Form that helps you avoid costly mistakes. Expert legal guidance. Affordable solutions. Level the playing field. Get the legal edge you deserve. Confidently navigate legal complexities. Secure your future. Call us.',
    form_owner: 'legalops@coheso.com',
    created_on: new Date().toString(),
    fields: [
      {
          "field_id": "field--1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
          "field_label": "Potential Customer Company Name",
          "field_type": "text",
          "placeholder": "Blackacre Corporation",
          "required": true
      },
      {
          "field_id": "field--2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
          "field_label": "Customer Contact Name",
          "field_type": "text",
          "placeholder": "John Doe",
          "required": true
      },
      {
          "field_id": "field--3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
          "field_label": "Customer Contact Email",
          "field_type": "text",
          "placeholder": "john.doe@blackacrecorp.com",
          "required": true
      },
      {
          "field_id": "field--4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
          "field_label": "Our Sales Representative",
          "field_type": "text",
          "placeholder": "Jane Smith",
          "required": true
      },
      {
          "field_id": "field--5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",
          "field_label": "Expected Deal Size",
          "field_type": "single-select",
          "options": [
              {
                  "key": "small",
                  "value": "Less than $100,000"
              },
              {
                  "key": "medium",
                  "value": "$100,000 - $500,000"
              },
              {
                  "key": "large",
                  "value": "$500,000 - $1,000,000"
              },
              {
                  "key": "enterprise",
                  "value": "Over $1,000,000"
              }
          ],
          "required": true
      },
    ],
  },
  submission:{
    submission_id:'',
    form_version_id:'',
    data:[],
    createdOn:'',
  },
  forms: [],
  addForm: (form: Form) => set((state) => ({ forms: [...state.forms, form] , form: form})),
  previewForm: (form:Form) => set((state) => ({form: form})),
  previewSubmission: (submission:Submission) => set((state) => ({submission: submission}))
}));
