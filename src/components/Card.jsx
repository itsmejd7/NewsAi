import React from 'react';

 function Card() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4" />
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2 w-full" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2 w-5/6" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2" />
    </div>
  );
}

export default Card