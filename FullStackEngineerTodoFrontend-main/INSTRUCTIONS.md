# Task Instructions for Augmenting the ToDo List Application

Welcome to the Frontend Todo application! Your tasks are to enhance the existing application and resolve a bug. 

Below are the instructions and requirements for the enhancements to match the expectations on the backend application. 

Be sure to complete each of the tasks below to the best of your ability.
Update documentation as necessary and/or add comments as you go along.

If anything is unclear or you have technical difficulty, please comment with your observations and/or what
you would do given more time or resources.

Reference the README.md for project specific initial setup, migration creation, and testing instructions.

Note this is OPEN BOOK - it is OK if you do know currently user any of the technologies listed above, please just try your 
best and use any and all resources at your disposal to find and fix the tasked items. Be ready to discuss any changes 
you have made to the application or discoveries while working on the application code.

Take your time, and have fun!

### Initial Configuration

Create a ".env" file to have the two values below configured to credit you as the author and to connect with the backend API url. This will resolve the "CONFIGURAITON ERROR" in the console and blank screen.

    ```bash
    TODO_AUTHOR_NAME=
    TODO_BACKEND_API_URL=
    ```

### Task 1: Fix the app routing so that users can visit available routes.

The routing is broken, there should be three distinct routes, but for some reason all of the routes are going to the list page.

**View Todos Route**
   - `/` and `/list` should load the TodoList component.

**Add Todo Route**
   - `/add` should load the TodoForm component.

**Details Route**
   - `/todos/[todo_id]` should load the TodoDetails component and feed it the id so that it can load the details.

### Task 2: Create a Header Component for the Application

Implement a `Header` component that will be displayed across all pages of the application. The header should meet the following criteria:

**App Name Navigation:**
   - Display the app name on the leftmost side of the header.
   - Clicking the app name should navigate to the root of the application (`"/"`).

**Action Items:**
   - Include two action items on the rightmost side of the header:
     - **View List:** Clicking this should navigate to the list of todos (`"/"`).
     - **Add Todo:** Clicking this should navigate to the form to add a new todo (`"/add"`).

**Styling:**
   - Ensure the header has a consistent and clean style that aligns with the rest of the application.
   - The header should be responsive and maintain a good layout on both desktop and mobile devices.


### Task 3: Delete functionality is broken.

User is reporting the following: "For some reason, when I click delete, the todo item gets removed from my list but next time I refresh the page, the todo item is back in the list!!! This is frustrating!"


### Bonus (not required)

User feature request: Users have been requesting the ability to Edit their todos; currently they need to remove and re-add a todo if they make a mistake. We had an edit button, but no user interface to go with it.