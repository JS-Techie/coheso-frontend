
export interface Option {
    key: string;
    value: string;
  }
  
export interface FieldBase {
field_id: string;
field_label: string;
required: boolean;
}

export interface FieldWithString extends FieldBase {
field_type: 'text' | 'long-text' | 'date';
placeholder?: string;
}

export interface FieldWithOptions extends FieldBase {
field_type: 'single-select' | 'multi-file';
options?: Option[];
}

export type Field = FieldWithString | FieldWithOptions;


export interface Form {
    form_id: string;
    version: string;
    form_version_id: string;
    form_name: string;
    form_description: string;
    form_owner: string;
    created_on: string;
    fields: Field[];
  }


export  interface SubmissionField {
    field_id: string;
    value: string[];
  }
  
export interface Submission {
    submission_id: string;
    form_version_id: string;
    data: SubmissionField[];
    createdOn: string;
  }