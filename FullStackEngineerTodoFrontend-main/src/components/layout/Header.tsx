import React from "react";
import PrimaryLink from "components/links/PrimaryLink";
import SecondaryLink from "components/links/SecondaryLink";

// Import from React Icons Library
// Actively maintained with regular updates
// Large user base and strong community support
// Clear and comprehensive documentatiom
// 2 million weekly downloads
// https://www.npmjs.com/package/react-icons
import { GiCheckMark } from "react-icons/gi";

/**
 * A component that renders a fixed header at the top of the window.
 * 
 * @returns {React.FC} The Header component.
 */
const Header: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white py-4 px-6 h-14 fixed top-0 left-0 right-0 w-full shadow-lg flex flex-row justify-between">
            {/* App Name Link */}
            <PrimaryLink path="/" icon={<GiCheckMark />} label="ToDo"  ariaLabel="App Logo and Name link" />
            {/* Action Items */}
            <div className="space-x-6 flex text-xs md:text-sm items-center">
                <SecondaryLink path="/" label="View List" ariaLabel="ToDo List link" />
                <SecondaryLink path="/add" label="Add Todo" ariaLabel="Add Todo link" />
            </div>
        </nav>
    )
}

export default Header;