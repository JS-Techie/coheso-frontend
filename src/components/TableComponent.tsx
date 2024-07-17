"use client"
import React, { useEffect, useState } from 'react';
import { useFormStore } from '../stores/formStore';
import { v4 as uuidv4 } from 'uuid';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, getKeyValue, Spinner, Card, CardBody, Input} from "@nextui-org/react";
import {useAsyncList} from "@react-stately/data"


import { DeleteIcon } from './DeleteIcon';
import { EditIcon } from './EditIcon';
import { EyeIcon } from './EyeIcon';

interface Form {
    [key: string]: any;
  }

  interface TableProps {
    rows: Form[];
    columns: any[];
    filterKeys: string[];
}


const TableComponent: React.FC<TableProps>= ({rows, columns, filterKeys}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<keyof Form | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };
  
    const handleSort = (key: keyof Form) => {
      setSortKey(key);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
  
    const filteredForms = rows
      .filter((form) => {
        for (const filterKey of filterKeys) {
          if (form[filterKey] && form[filterKey].toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
          }
        }
      
        return false;
      }
      )
      .sort((a, b) => {
        if (sortKey) {
          const compare = a[sortKey] < b[sortKey] ? -1 : 1;
          return sortOrder === 'asc' ? compare : -compare;
        }
        return 0;
      });
  
    return (
      <Card>
        <CardBody>
            <Input
            fullWidth
            placeholder="Search by keyword"
            onChange={handleSearch}
            className="mb-4"
        />
          <Table>
            <TableHeader>
              {columns.map((column) =>
                  <TableColumn key={column.key} className='justify-center items-center text-center' onClick={() => handleSort(column.label)}>{column.label}</TableColumn>
                )}
            </TableHeader>
            <TableBody 
                isLoading={isLoading}
                loadingContent={<Spinner label="Loading..." />}
                emptyContent="NO DATA AVAILABLE "
                >
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  {columns.map((column) =>
                      <TableCell key={column.key} className='justify-center items-center text-center'>{column.key === 'created_on' ? new Date(form[column.key]).toLocaleString() : form[column.key]}</TableCell>    
                    )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    );
  };
      
    
export default TableComponent;
