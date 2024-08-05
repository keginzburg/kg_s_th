import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToDo, ToDoFormProps } from 'types/types';

/**
 * TodoForm component is used to add new Todo items to the TodoList.
 * It contains a form with input fields for title, description, and priority.
 * Handles form submission and sends a POST request to the backend API to add a new Todo item.
 *
 * @param {ToDoFormProps} props - The props object.
 * @param {string} props.type - The type of TodoForm that should be rendered (Add or Edit).
 * 
 * @returns {React.FC} The TodoForm component.
 */
const TodoForm: React.FC<ToDoFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Retrieve the ID from URL parameters if we're attempting to edit a ToDo
  const [formData, setFormData] = useState<ToDo>({
    id: 0,
    title: '',
    completed: false,
    description: '',
    priority: 1,
  });
  const [loading, setLoading] = useState<boolean>(false); // State to indicate submission status
  const [error, setError] = useState<boolean>(false); // State to conditionally render a form error

  /**
   * Tracks id param and type prop to fetch the todo (set for edits) from the backend API when the component mounts or id param changes.
   * Updates the formData state based on the response to prefill inputs with todo data.
   */
  useEffect(() => {
    if (id && type === 'edit') {
      fetch(`${process.env.TODO_BACKEND_API_URL}/todos/${id}`)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
          return response.json();
        })
        .then(data => {
          setFormData(data);
        })
        .catch(error => {
          console.error('Error fetching todo details:', error);
          navigate('/'); 
        });
    }
  }, [id, type])

  /**
   * Tracks type prop changes when navigating from Edit TodoForm to Add TodoForm.
   * Resets the formData state to clear prefilled inputs.
   */
  useEffect(() => {
    if (type === 'add') {
      setFormData({
        id: 0,
        title: '',
        completed: false,
        description: '',
        priority: 1,
      });
      setError(false);
    }
  }, [type])

  /**
   * Handles the form submission.
   * Prevents the default form submission behavior, sets loading state to true,
   * and sends a POST request to the backend to add a new Todo item.
   * Updates the form state and loading status based on the response.
   * 
   * @param event - The form submission event
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form behavior
    setLoading(true); // Set loading to true when submission starts

    // Dynamic `path` and `method` based on `type` prop
    const path = `${process.env.TODO_BACKEND_API_URL}/${type === 'add' ? 'todos' : `todos/${id}`}`
    const method = type === 'add' ? 'POST' : 'PUT';

    fetch(path, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        return response.json();
      })
      .then(() => {
        setFormData({ id: 0, completed: false, title: '', description: '', priority: 1 }); // Clear the form data
        setLoading(false); // Set loading to false after submission completes
        setError(false); // Clear existing errors after succesful submission
        navigate('/'); // Send the viewer back to the list to see their changes
      })
      .catch(error => {
        console.error('Error adding todo:', error); // Log any errors
        setLoading(false); // Set loading to false if an error occurs
        setError(true) // If an error has been encountered server side, then set error to true for styling and element change
      });
  };

  // Handle changes to form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Determines if input is of type checkbox. If yes, casts e.target as HTMLInputElement and stores its checked property.
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    // Include all previous formData values on element change and update current changes for all element types.
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : name === 'priority' ? Number(value) : value,
    }));
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col items-stretch mb-6 p-4 bg-white shadow-lg rounded-lg"
    >
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className={`p-3 border rounded-md mb-3 w-full ${error ? 'border-red-300' : 'border-gray-300'}`}
        disabled={loading}
        required
        />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className={`p-3 border rounded-md mb-3 w-full ${error ? 'border-red-300' : 'border-gray-300'}`}
        rows={3}
        disabled={loading} 
        required
        />
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className={`p-3 border rounded-md mb-4 w-full ${error ? 'border-red-300' : 'border-gray-300'}`}
        disabled={loading} // Disable select when loading
        required // Make this field required
        >
        <option value="">Select priority</option> {/* Default option */}
        <option value={1}>High</option>
        <option value={2}>Medium</option>
        <option value={3}>Low</option>
      </select>
      {type === 'edit' ? <label className='flex items-center mb-4'>
        <input
          type="checkbox"
          name="completed"
          checked={formData.completed}
          onChange={handleChange}
          className='mr-2'
          disabled={loading}
        />
        Completed
      </label> : null}
      <button
        type="submit"
        className={`px-4 py-3 rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        disabled={loading} // Disable button when loading
      >
        {/* Show loading text for ToDo creation or updating */}
        {loading ? (type === 'edit' ? 'Updating...' : 'Adding...') : (type === 'edit' ? 'Update' : 'Add')} 
      </button>
      {error ? <h1 className='flex justify-center pt-3 text-red-400'>There was an issue with your ToDo.</h1> : null}
    </form>
  );
}

export default TodoForm;