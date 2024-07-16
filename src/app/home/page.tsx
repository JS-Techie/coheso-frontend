// components/HomePage.tsx
"use client"
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FormDocument from '@/components/FormDocumentPreview';

const HomePage: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 150, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full max-w-4xl p-5 bg-white border-transparent rounded-lg shadow-lg shadow-blue-400"
      >
        <div className="h-[80vh] translate-y-[3vh] relative mt-[-3rem]">
          <div className='h-full overflow-y-clip'>
            <FormDocument preview={true}/>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y:0, opacity: 0 }}
        animate={{ y:30, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-[2rem] text-[5.2rem] font-bold text-center text-blue-600 z-5 cursor-pointer"
      >
        <Link href='/cardmenu'>
            CREATE A NEW FORM 
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;
