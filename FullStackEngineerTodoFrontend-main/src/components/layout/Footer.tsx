import React from 'react';

/**
 * A component that renders a fixed footer at the bottom of the window.
 * 
 * @returns {React.FC} The Footer component.
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 bottom-0 left-0 w-full">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} {process.env.TODO_AUTHOR_NAME}.
      </p>
    </footer>
  );
}

export default Footer;
