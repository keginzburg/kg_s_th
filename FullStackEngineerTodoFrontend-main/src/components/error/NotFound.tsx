import React from 'react';

/**
 * A component that renders a 404 Not Found message.
 * 
 * @returns {React.FC} The NotFound component.
 */
const NotFound: React.FC = () => {
  return (
    <div className="text-black text-center p-8 w-full bg-gray-100 rounded-lg shadow-lg">
      <h2 className='text-2xl font-semibold'>
        404 Not Found
      </h2>
      <h3 className='text-xl'>
        Where do you think you're going? You've got stuff <strong className='font-pacifico'>ToDo</strong>!
      </h3>
    </div>
  );
}

export default NotFound;