import React from 'react';
import Statistics from '@/components/Statistics';
import Header from '@/components/Header'; // Added Header
import Footer from '@/components/Footer'; // Added Footer

const BrowsePage: React.FC = () => {
  return (
    <>
      <Header />
      {/* Adjust pt- value based on actual Header height */}
      <main className="pt-16 md:pt-20 min-h-screen">
        <Statistics />
      </main>
      <Footer />
    </>
  );
};

export default BrowsePage;
