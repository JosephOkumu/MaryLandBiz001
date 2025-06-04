import React from 'react';
import Statistics from '@/components/Statistics';

const BrowsePage: React.FC = () => {
  return (
    <main className="pt-4 md:pt-8"> {/* Adjusted padding */}
      <Statistics />
    </main>
  );
};

export default BrowsePage;
