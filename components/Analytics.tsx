import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
      <h2 className="text-2xl font-bold text-charcoal mb-4">Analytics</h2>
      <p className="text-cool-gray">
        This is where your sales analytics, shipping performance, and other key metrics would be displayed.
      </p>
      <div className="mt-8 text-seafoam">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      </div>
    </div>
  );
};

export default Analytics;