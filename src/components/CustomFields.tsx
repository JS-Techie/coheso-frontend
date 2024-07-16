"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardBody, Textarea, Button, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger, Input, DatePicker, Checkbox } from "@nextui-org/react";

import { Option } from '@/interfaces/interfaces.d';


// interface Option {
//     key: string;
//     value: string;
//   };


interface CustomField {
  field_id: string;
  field_label: string;
  field_type: string;
  field_value: any;
  submitted: boolean;
  required: boolean;
}

interface CustomFieldProps {
    index: number;
    fieldData: CustomField;
    handleCustomFieldChange: (index: number, fieldData: CustomField) => void;
  }
  
  


const CustomFields: React.FC<CustomFieldProps> = ({ index, fieldData, handleCustomFieldChange }) => {
  const [field, setField] = useState<CustomField>(fieldData);
  const [editMode, setEditMode] = useState<boolean>(true);
  const [selectedFieldType, setSelectedFieldType] = useState<string>(field.field_type);
  const [options, setOptions] = useState<Option[]>(()=> field.field_type === 'single-select' || field.field_value === 'multi-file' ? JSON.parse(field.field_value) : []);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddOptionClick = () => {
    setOptions([...options, { key: '', value: '' }]);
  };
  
  const handleOptionChange = (index: any, type: any, value: any) => {
    const updatedOptions = options.map((option, i) =>
      i === index ? { ...option, [type]: value } : option
    );
    setOptions(updatedOptions);
  };
  
  const handleDeleteOptionClick = (index: any) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };
  
  const handleSubmitOptionsClick = () => {
    const updatedField = { ...field, 'field_value': options };
    setField(updatedField)
    console.log('Submitted options:', options);
  };
  

  const items = [
    { key: "text", label: "TEXT" },
    { key: "long-text", label: "LONG TEXT" },
    { key: "date", label: "DATE" },
    { key: "single-select", label: "SINGLE SELECT" },
    { key: "multi-file", label: "MULTIPLE FILE" }
  ];


  useEffect(() => {
    setField(fieldData);
  }, [fieldData]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >, fieldKey: keyof CustomField) => {
    const updatedField = { ...field, [fieldKey]: e.target.value };
    setField(updatedField);
  };

  const handleSubmit = () => {
    setEditMode(!editMode);
    console.log("THE SUBMITTED FIELD::: ", field)
    handleCustomFieldChange(index, { ...field, submitted: !field.submitted });
  };

  return (
    <Card className="w-full">
      <CardBody>
        <div className="grid grid-cols-12 gap-4 justify-between p-4">
          <div className="text-right col-span-3">
            Field ID:
          </div>
          <div className="text-left col-span-8">
            <Textarea minRows={1} size='sm' isDisabled value={field ? fieldData.field_id : ''} />
          </div>
          <div className="text-right col-span-3">
            Field Label:
          </div>
          <div className="text-left col-span-8">
            <Textarea 
              isRequired 
              placeholder="Enter Field Label" 
              minRows={1} 
              size='sm' 
              value={field ? field.field_label : ''}
              onChange={(e) => handleFieldChange(e, 'field_label')}
              disabled={!editMode}
              className={editMode ? 'bg-white' : 'bg-gray-200'}
            />
          </div>
          <div className="text-right col-span-3">
            isMandatory:
          </div>
          <div className="text-left col-span-8">
            <Checkbox defaultSelected isSelected={field.required} isDisabled={!editMode} onValueChange={() => setField({...field, 'required': !field.required})}/>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 justify-between p-4">
          <div className="text-right col-span-3">
            Field Type:
          </div>
          <div className="text-left col-span-8">
            <Dropdown isDisabled={!editMode}>
              <DropdownTrigger>
                <Button size='sm' variant='bordered'>
                  {!selectedFieldType ? "Select Field Type" : selectedFieldType}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions" items={items} onAction={(key) => {
                                                                                            setSelectedFieldType(key as string)
                                                                                            handleFieldChange({ target: { value: key } } as React.ChangeEvent<HTMLInputElement>, 'field_type')
                                                                                        }}>
                {(item) => (
                  <DropdownItem key={item.key}>
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

        </div>
        <div className="grid grid-cols-12 gap-4 justify-end p-4">
            <div className="text-right col-span-3">
                {selectedFieldType ? 'Field Value:':''}
            </div>
            <div className="text-left col-span-8 col-start-4">
                {selectedFieldType === "text" && (
                <input 
                    type="text" 
                    placeholder="Enter Field Value" 
                    value={field && field.field_type === 'text' ? field.field_value : ''}
                    onChange={(e) => handleFieldChange(e, 'field_value')}
                    disabled={!editMode}
                    className={editMode ? 'bg-white' : 'bg-gray-200'}
                />
                )}
                {selectedFieldType === "long-text" && (
                <textarea 
                    placeholder="Enter Field Value" 
                    value={field && field.field_type === 'long-text' ? field.field_value : ''}
                    onChange={(e) => handleFieldChange(e, 'field_value')}
                    disabled={!editMode}
                    className={editMode ? 'bg-white' : 'bg-gray-200'}
                />
                )}
                {selectedFieldType === "date" && (
                <input 
                    type="date" 
                    value={field && field.field_type === 'date' ? field.field_value : ''}
                    onChange={(e) => handleFieldChange(e, 'field_value')}
                    disabled={!editMode}
                    className={editMode ? 'bg-white' : 'bg-gray-200'}
                />
                )}
                {(selectedFieldType === "single-select" || selectedFieldType == "multi-file") && (
                <div>
                    <div className="flex flex-col gap-4 mt-4">
                    {options.map((option, index) => (
                        <div key={index} className="flex gap-4 mt-2 items-center">
                        <input
                            type="text"
                            placeholder="Key"
                            disabled={!editMode}
                            value={option.key}
                            onChange={(e) => handleOptionChange(index, 'key', e.target.value)}
                            className="border rounded p-2 w-1/2"
                        />
                        <input
                            type="text"
                            placeholder="Value"
                            value={option.value}
                            disabled={!editMode}
                            onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                            className="border rounded p-2 w-1/2"
                        />
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => handleDeleteOptionClick(index)}
                            disabled={!editMode}
                        >
                            Delete
                        </button>
                        </div>
                    ))}
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAddOptionClick}
                        disabled={!editMode}
                    >
                        Add Option
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                        onClick={handleSubmitOptionsClick}
                        disabled={!editMode}
                    >
                        Submit Options
                    </button>
                    </div>
                </div>
                )}
            </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button color={editMode ? "success" : "primary"} onClick={handleSubmit}>
            {editMode ? 'Submit' : 'Edit'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomFields;
