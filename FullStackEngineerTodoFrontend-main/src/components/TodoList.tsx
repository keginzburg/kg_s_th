import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToDo } from 'types/types';
import ToDoListItemButton from './ToDoListItemButton';

/**
 * A component that displays a list of ToDos.
 * Fetches the ToDos from the backend API and handles loading and error states.
 * Renders a list of ToDos with links to detailed views and a delete action.
 * 
 * @returns {React.FC} The TodoList component.
 */
const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<ToDo[]>([]); // State to store the list of todos
  const [loading, setLoading] = useState<boolean>(true); // State to indicate loading status
  const navigate = useNavigate();
  
  /**
   * Fetches the list of todos from the backend API when the component mounts.
   * Updates the todos state and loading status based on the response.
   */
  useEffect(() => {
    fetch(`${process.env.TODO_BACKEND_API_URL}/todos`)
      .then(response => response.json())
      .then(data => {
        setTodos(data); // Set the fetched todos
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching todos:', error); // Log any errors
        setLoading(false); // Set loading to false if an error occurs
      });
  }, []);

  /**
   * Deletes a ToDo item by sending a DELETE request to the backend API.
   * Updates the todos state to remove the deleted item.
   * 
   * @param id - The ID of the ToDo item to be deleted.
   */
  const handleDelete = (id: number) => {
    fetch(`${process.env.TODO_BACKEND_API_URL}/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Remove the deleted todo from the state
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  /**
   * Navigates to the path of `/todos/:id/edit` with a unique ToDo's id.
   * User can then interact with ToDoForm with type of `edit` to edit existing ToDo.
   * 
   * @param id - The ID of the ToDo item to be edited.
   */
  const handleEdit = (id: number) => {
    return () => {
      navigate(`/todos/${id}/edit`);
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">My List</h2>
      
      {loading ? (
        <p className="text-gray-600">Loading...</p> // Display loading message
      ) : (
        todos.length > 0 ? (
          <ul className="list-disc pl-5 space-y-4">
            {todos.map(todo => (
              <li key={todo.id} className={`p-4 border rounded ${todo.completed ? 'bg-green-200' : 'bg-white'} flex items-center justify-between`}>
                <Link to={`/todos/${todo.id}`} className={`flex-1 ${todo.completed ? 'line-through text-gray-600' : ''}`}>
                  {todo.title}
                </Link>

                {/* Edit Button */}
                <ToDoListItemButton
                  handler={handleEdit(todo.id)}
                  color='blue'
                  ariaLabel='Edit todo'
                  label='Edit'
                />
                {/* Delete Button */}
                <ToDoListItemButton
                  handler={() => handleDelete(todo.id)}
                  color='red'
                  ariaLabel='Delete todo'
                  label='X'
                />
               
                {/* Both of the below JSX buttons share similarities and repeat code. */}
                {/* <button
                  onClick={() => navigate(`/todos/${todo.id}/edit`)}
                  className="ml-4 px-4 py-2 text-blue-500 hover:text-blue-700 focus:outline-none border border-blue-500 rounded"
                  aria-label="Edit todo"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="ml-4 px-4 py-2 text-red-500 hover:text-red-700 focus:outline-none border border-red-500 rounded"
                  aria-label="Delete todo"
                >
                  X
                </button> */}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col mb-6 p-4 bg-white shadow-lg rounded-lg">
            <p className="text-gray-600">No Todos available</p>
            <div>
              <a
                className="inline-block px-4 py-3 mt-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onClick={() => navigate('/add')}
              >
                Add New Todo
              </a>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default TodoList;
