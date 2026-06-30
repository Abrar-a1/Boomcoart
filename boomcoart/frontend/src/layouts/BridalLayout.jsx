import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function BridalLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] font-serif selection:bg-[#e0d6c8]">
      <Navbar mode="bridal" />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.03)] border border-[#f0ece6] p-8 md:p-16 mb-16">
           {children}
        </div>
      </main>

      <div className="border-t border-[#f0ece6]">
        <Footer />
      </div>
    </div>
  );
}
