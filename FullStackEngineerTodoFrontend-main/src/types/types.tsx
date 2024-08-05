export interface ToDo {
    id: number;
    title: string;
    completed: boolean;
    description?: string;
    priority: number;
}

export interface ToDoFormProps {
    type: string;
}

export interface PrimaryLinkProps {
    path: string;
    icon: React.ReactNode;
    ariaLabel: string;
    label: string;
}

export interface BasicLinkProps {
    path: string;
    ariaLabel: string;
    label: string;
}

type HandlerFunction = () => void | ((id: number) => () => void);

export interface ToDoListItemButtonProps {
    handler: HandlerFunction;
    color: string;
    ariaLabel: string;
    label: string;
}