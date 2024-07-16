"use client"
import React, { useEffect, useState } from 'react';
import { useFormStore } from '@/stores/formStore';
import { v4 as uuidv4 } from 'uuid';
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Textarea, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

const CardNavigationPage: React.FC = () => {
      
    return (
        <div className='grid grid-cols-5 gap-10 mt-[8%]'>
            <Link className="border-none w-full h-[400px] col-start-2 ml-[30%] cursor-pointer" href='/build'>
            <Card
                isFooterBlurred
                isPressable
                radius="sm"
                className="border-none w-full h-[400px] cursor-pointer"
                onPress={() => console.log("CARD I IS PRESSED")}
                >
                    <img
                        alt="first card"
                        className="object-cover w-full h-full"
                        src="https://cms-article.forbesindia.com/media/images/2023/Jan/img_201619_handwritingsm.jpg"
                        />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 shadow-small z-10">
                    <p className="text-tiny text-white">Form Builder</p>
                </CardFooter>
            </Card>
            </Link>
            <Link className="border-none w-full h-[400px] ml-[60%] col-start-3 cursor-pointer" href='/preview'>
            <Card
                isFooterBlurred
                isPressable
                radius="sm"
                className="border-none w-full h-[400px] cursor-pointer"
                onPress={()=> console.log("THIS IS THE ONCLICK SECOND CARD")}
                >
                    <img
                        alt="second card"
                        className="object-cover w-full h-full"
                        src="https://www.themandarin.com.au/wp-content/uploads/2022/12/journal-articles-papers.jpg?resize=600,400"
                        />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 shadow-small z-10">
                    <p className="text-tiny text-white/100">Form Preview</p>
                </CardFooter>
            </Card>
            </Link>
      </div>
    );
    };

export default CardNavigationPage;
