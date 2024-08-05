import React from "react";
import { ToDoListItemButtonProps } from "types/types";

/**
 * A component that renders a dynamic ToDo list item button.
 * 
 * @param {ToDoListItemButtonProps} props - The props object.
 * @param {HandlerFunction} props.handler - The handler function to be called on button click.
 * @param {string} props.color - The color to be applied to Tailwind style classes.
 * @param {string} props.ariaLabel - The aria label for the button.
 * @param {string} props.label - The inner text label for the button.
 * 
 * @returns {React.FC} The ToDoListItemButton component.
 */
const ToDoListItemButton: React.FC<ToDoListItemButtonProps> = ({handler, color, ariaLabel, label}) => {
    return (
        <button
            onClick={handler}
            className={`ml-4 px-4 py-2 text-${color}-500 hover:text-${color}-700 focus:outline-none border border-${color}-500 rounded`}
            aria-label={ariaLabel}
        >
            {label}
        </button>
    )
}

export default ToDoListItemButton;