import React from "react";
import { Link } from "react-router-dom";
import { BasicLinkProps } from "types/types";


/**
 * A component that renders a dynamic link.
 * 
 * @param {BasicLinkProps} props - The props object.
 * @param {string} props.path - The path to navigate to when the Link is clicked.
 * @param {string} props.ariaLabel - The aria label for the Link.
 * @param {string} props.label - The inner text label for the Link.
 * 
 * @returns {React.FC} The SecondaryLink component.
 */
const SecondaryLink: React.FC<BasicLinkProps> = ({path, label, ariaLabel}) => {
    return (
        <Link
            to={path}
            className="inline-block px-2 py-1  rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label={ariaLabel}
        >
            {label}
        </Link>
    )
}

export default SecondaryLink;