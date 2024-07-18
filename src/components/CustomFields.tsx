"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardBody, Textarea, Button, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger, Input, DatePicker, Checkbox } from "@nextui-org/react";
import { useSearchParams } from 'next/navigation';
import { Option } from '@/interfaces/interfaces.d';

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
  const [editMode, setEditMode] = useState<boolean>(useSearchParams().get('status') == 'Edit' ? false : !field.submitted);
  const [selectedFieldType, setSelectedFieldType] = useState<string>(field.field_type);
  const [options, setOptions] = useState<Option[]>(()=> field.field_type === 'single-select' ? JSON.parse(field.field_value) : []);
  const [editOptionsMode, setEditOptions] = useState(false);
  const items = [
    { key: "text", label: "TEXT" },
    { key: "long-text", label: "LONG TEXT" },
    { key: "date", label: "DATE" },
    { key: "single-select", label: "SINGLE SELECT" },
    { key: "multi-file", label: "MULTIPLE FILE" }
  ];

  useEffect(() => {
    setField(fieldData);
    setSelectedFieldType(fieldData.field_type)
    setEditMode(!fieldData.submitted)
    if (fieldData.field_type === 'single-select')
      setOptions(JSON.parse(fieldData.field_value))
  }, [fieldData]);


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
    setEditOptions(false)
  };

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
    <Card className="w-full }">
      <CardBody className={`${!editMode ? 'bg-gray-300' : 'bg-white'}`}>
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
              isDisabled={!editMode}
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
                {selectedFieldType ? selectedFieldType === 'single-select'?'Options:':'Placeholder Value:':''}
            </div>
            <div className="text-left col-span-8 col-start-4">
                {selectedFieldType === "text" && (
                <input 
                    type="text" 
                    placeholder="Enter Placeholder Value" 
                    value={field && field.field_type === 'text' ? field.field_value : ''}
                    onChange={(e) => handleFieldChange(e, 'field_value')}
                    disabled={!editMode}
                    className={editMode ? 'bg-white' : 'bg-gray-200'}
                />
                )}
                {selectedFieldType === "long-text" && (
                <textarea 
                    placeholder="Enter Placeholder Value" 
                    value={field && field.field_type === 'long-text' ? field.field_value : ''}
                    onChange={(e) => handleFieldChange(e, 'field_value')}
                    disabled={!editMode}
                    className={editMode ? 'bg-white' : 'bg-gray-200'}
                />
                )}
                {selectedFieldType === "date" && (
                <input 
                    type="text" 
                    placeholder='Enter Placeholder Value'
                    value={field && field.field_type === 'date' ? field.field_value : ''}
                    onChange={(e) => handleFieldChange(e, 'field_value')}
                    disabled={!editMode}
                    className={editMode ? 'bg-white' : 'bg-gray-200'}
                />
                )}
                {selectedFieldType === "multi-file" && (
                <input 
                    type="text"
                    placeholder='Enter Placeholder Value'
                    value={field && field.field_type === 'multi-file' ? field.field_value : ''}
                    onChange={(e) => handleFieldChange(e, 'field_value')}
                    disabled={!editMode}
                    className={editMode ? 'bg-white' : 'bg-gray-200'}
                />
                )}
                {(selectedFieldType === "single-select") && (
                <div>
                    <div className="flex flex-col gap-4 mt-4">
                    {options.map((option, index) => (
                        <div key={index} className="flex gap-4 mt-2 items-center">
                        <input
                            type="text"
                            placeholder="Key"
                            disabled={!editMode || !editOptionsMode}
                            value={option.key}
                            onChange={(e) => handleOptionChange(index, 'key', e.target.value)}
                            className="border rounded p-2 w-1/2"
                        />
                        <input
                            type="text"
                            placeholder="Value"
                            value={option.value}
                            disabled={!editMode || !editOptionsMode}
                            onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                            className="border rounded p-2 w-1/2"
                        />
                        <Button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => handleDeleteOptionClick(index)}
                            isDisabled={!editMode || !editOptionsMode}
                        >
                            Delete
                        </Button>
                        </div>
                    ))}
                    <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAddOptionClick}
                        isDisabled={!editMode || !editOptionsMode}
                    >
                        Add Option
                    </Button>
                    {
                      editOptionsMode ? 
                      <Button
                          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                          onClick={handleSubmitOptionsClick}
                          isDisabled={!editOptionsMode || options.length === 0}
                      >
                          Submit Options
                      </Button>
                      :
                      <Button
                        className="bg-blue-950 text-white px-4 py-2 rounded mt-4"
                        onClick={()=> setEditOptions(true)}
                        isDisabled={!editMode}
                      >
                          Edit Options
                      </Button>
                    }
                    </div>
                </div>
                )}
            </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button isDisabled={(selectedFieldType && selectedFieldType === 'single-select') ? editOptionsMode : (!selectedFieldType ? true : false)} color={editMode ? "success" : "primary"} onClick={handleSubmit}>
            {editMode ? 'Submit' : 'Edit'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomFields;
