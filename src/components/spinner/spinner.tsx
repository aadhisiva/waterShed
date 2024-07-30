import React from 'react';
import './spinner.css';

export default function SpinnerLoader({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading ? (
        <div className="loading">
          <span className="text-black">Loading</span>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
