import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoList from './components/TodoList';
import Footer from 'components/layout/Footer';
// Addition of TodoForm, TodoDetails, Header, and NotFound 
import TodoForm from 'components/TodoForm';
import TodoDetails from 'components/TodoDetails';
import Header from 'components/layout/Header';
import NotFound from 'components/error/NotFound';
import { useConfigCheck } from 'hooks/useConfigCheck ';

/**
 * The main application component that sets up routing for the app.
 * Uses React Router to define routes and render different components based on the URL.
 * 
 * @returns {React.FC} The App component.
 */
const App: React.FC = () => {
  const configError = useConfigCheck();

  if (configError){
    console.error('CONFIGURATION ERROR');
    return;
  } 

  const toDoListPaths: string[] = ["/", "/list"]

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto p-4 mt-14">
          <Routes>
            {/* ToDoForm Add Route */}
            <Route path="/add" element={<TodoForm type={'add'}/>} />
            {/* ToDoDetails Route */}
            <Route path="/todos/:id" element={<TodoDetails />} />
            {/* ToDoForm Edit Route */}
            <Route path="/todos/:id/edit" element={<TodoForm type={'edit'}/>} />
            {/* ToDoList Routes */}
            {toDoListPaths.map((path, idx) => (
              <Route key={idx} path={path} element={<TodoList />}/>
            ))}
            {/* Wildcard NotFound Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;