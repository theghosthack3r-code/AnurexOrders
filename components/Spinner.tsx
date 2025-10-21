import React from 'react';

const Spinner: React.FC<{ large?: boolean }> = ({ large = false }) => (
  <div
    className={`animate-spin rounded-full border-t-2 border-b-2 ${large ? 'h-12 w-12 border-seafoam' : 'h-5 w-5 border-white mr-2'}`}
  ></div>
);

export default Spinner;