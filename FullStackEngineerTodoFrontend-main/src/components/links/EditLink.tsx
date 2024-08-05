import React from "react";
import { Link } from "react-router-dom";
import { BasicLinkProps } from "types/types";

/**
 * A component that renders a resource edit link.
 *
 * @param {BasicLinkProps} props - The props object.
 * @param {string} props.path - The path to navigate to when the Link is clicked.
 * @param {string} props.ariaLabel - The aria label for the Link.
 * @param {string} props.label - The inner text label for the Link.
 * 
 * @returns {React.FC} The EditLink component.
 */
const EditLink: React.FC<BasicLinkProps> = ({path, label, ariaLabel}) => {
    return (
        <Link
            to={path}
            className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-auto'
            aria-label={ariaLabel}
        >
            {label}
        </Link>
    )
}

export default EditLink;