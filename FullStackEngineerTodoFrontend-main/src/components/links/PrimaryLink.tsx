import React from "react";
import { Link } from "react-router-dom";
import { PrimaryLinkProps } from "types/types";

/**
 * A component that renders a dynamic link with a React Icon.
 * 
 * @param {PrimaryLinkProps} props - The props object.
 * @param {string} props.path - The path to navigate to when the Link is clicked.
 * @param {React.ReactNode} props.icon - The React Icon for the Link.
 * @param {string} props.ariaLabel - The aria label for the Link.
 * @param {string} props.label - The inner text label for the Link.
 * 
 * @returns {React.FC} The PrimaryLink component.
 */
const PrimaryLink: React.FC<PrimaryLinkProps> = ({path, icon, ariaLabel, label}) => {
    return (
        <Link to={path}>
            <h1
                className="hover:cursor-pointer hover:opacity-90 flex items-center space-x-2 text-lg font-pacifico"
                aria-label={ariaLabel}
            >
                {icon}
                <span>{label}</span>
            </h1>
            
        </Link>
    )
}

export default PrimaryLink;