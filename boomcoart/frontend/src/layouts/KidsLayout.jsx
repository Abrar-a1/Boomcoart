import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function KidsLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-yellow-50 selection:bg-blue-200">
      <div className="border-t-8 border-t-yellow-400 w-full" />
      {/* We can pass a prop to Navbar to make it playful, or use standard for now */}
      <Navbar mode="kids" />
      
      <main className="flex-grow container mx-auto px-4 py-8 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-yellow-100 p-6 md:p-10 mb-10 overflow-hidden">
           {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
