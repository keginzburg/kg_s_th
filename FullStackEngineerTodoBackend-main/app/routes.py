# `jsonify` utility for converting Python dict into JSON response
# `request` allows access to incoming request data
# `render_template` renders HTML templates for the application's views
# `abort` allows end of request with a specific HTTP status code, but no provision of a custom JSON response in body
# `redirect` allows redirect to different endpoint
from flask import jsonify, request, render_template, abort, redirect

# `Session` used for database session management
from sqlalchemy.orm import Session

# SQLAlchemy `db` instance
from app import db

# `ToDo` model that allows ORM of ToDo entries in database
from app.models import ToDo

# Dedicated function for organizing routing logic
def setup_routes(app):

    # Custom Error Handler for ToDo 404s
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'ToDo item not found'}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({'error': 'An unexpected server error occurred.'}), 500

    # Flask Decorator defines route
    # 1st arg is URL path for route
    # 2nd arg is a keyword argument to match an HTTP method
    @app.route('/', methods=['GET'])
    # Decorated function associated with above route
    def home():
        # Docstring that describes purpose of function
        """Redirect to Swagger UI"""
        # Actual response handled by matched route
        return redirect('/apidocs')

    # INDEX Route
    @app.route('/todos', methods=['GET'])
    def get_todos():
        """
        Retrieve a list of all TODO items.
        ---
        responses:
          200:
            description: A list of TODO items
            content:
              application/json:
                schema:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        description: The TODO item's ID
                      title:
                        type: string
                        description: The title of the TODO item
                      completed:
                        type: boolean
                        description: Completion status of the TODO item
                      description:
                        type: text
                        description: The detailed description of the TODO task
                      priority:
                        type: integer
                        description: Indication of priority of the TODO task (e.g., 1 for high, 2 for medium, 3 for low)
        """
        # SQLAlchemy interaction with db; provides session object for managing database sessions
        with db.session() as session:
            # Query session for `ToDo` table and dedicated `all` method to retrieve all records in table
            todos = session.query(ToDo).all()
            # Conversion of each `ToDo` instance into a dict representation for JSON serialization
            return jsonify([todo.to_dict() for todo in todos])
            
    # CREATE route
    @app.route('/todos', methods=['POST'])
    def create_todo():
        """
        Create a new TODO item.
        ---
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  title:
                    type: string
                    description: The title of the new TODO item
                    example: "New Task"
                  description:
                    type: text
                    description: The detailed description of the TODO task
                    example: "I have to do this new task before long because it's important."
                  priority:
                    type: integer
                    description: Indication of priority of the TODO task (e.g., 1 for high, 2 for medium, 3 for low)
                    example: 3
        responses:
          201:
            description: The created TODO item
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    id:
                      type: integer
                      description: The TODO item's ID
                    title:
                      type: string
                      description: The title of the TODO item
                    completed:
                      type: boolean
                      description: Completion status of the TODO item
                    description:
                      type: text
                      description: The detailed description of the TODO task
                    priority:
                      type: integer
                      description: Indication of priority of the TODO task (e.g., 1 for high, 2 for medium, 3 for low)
          400:
            description: Bad request, title, description, and priority are required
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: "Title is required", "Description is required", "Priority is required"
          422:
            description: Bad request, title, description, and/or priority failed validation
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: "Title cannot be empty", "Description cannot be empty", "Priority must be between 1 and 3"
        """
        # Parsing of incoming JSON data to dict or an empty dict {}
        data = request.get_json() or {}
        
        # Check if incoming request body has required fields: `title`, `description`, or `priority`. If not, respond with respective 400
        required_fields = {
          'title': 'Title is required',
          'description': 'Description is required',
          'priority': 'Priority is required'
        }
        for field, error in required_fields.items():
            if field not in data:
                return jsonify({'error': error}), 400

        # Try creation of new `ToDo` instance with `title`, `description`, and `priority` params
        try:
          todo = ToDo(title=data['title'], description=data['description'], priority=data['priority'])
          with db.session() as session:
              # Add the new `ToDo` instance to the session so SQlAlchemy will track and persist
              session.add(todo)
              # Commit current transaction to database if no database constraints hit
              session.commit()
              # Conversion of created `ToDo` instance into a dict representation for JSON serialization and 201 status
              return jsonify(todo.to_dict()), 201
        # If validations fail, then process the failure as 422 response
        except ValueError as e:
          return jsonify({'error': str(e)}), 422
        # Server Error
        except Exception as e:
          abort(500)

    # SHOW route
    @app.route('/todos/<int:id>', methods=['GET'])
    def get_todo_by_id(id):
        """
        Retrieve a TODO item by ID.
        ---
        parameters:
          - name: id
            in: path
            required: true
            description: The TODO item's ID
            schema:
              type: integer
        responses:
          200:
            description: The requested TODO item
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    id:
                      type: integer
                      description: The TODO item's ID
                    title:
                      type: string
                      description: The title of the TODO item
                    completed:
                      type: boolean
                      description: Completion status of the TODO item
                    description:
                      type: text
                      description: The detailed description of the TODO task
                    priority:
                      type: integer
                      description: Indication of priority of the TODO task (e.g., 1 for high, 2 for medium, 3 for low)
          404:
            description: TODO item not found
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: "ToDo item not found"
        """
        with db.session() as session:
            todo = session.get(ToDo, id)
            if todo is None:
                abort(404)
            return jsonify(todo.to_dict())

    # UPDATE route
    @app.route('/todos/<int:id>', methods=['PUT'])
    def update_todo(id):
        """
        Update a TODO item by ID.
        ---
        parameters:
          - name: id
            in: path
            required: true
            description: The TODO item's ID
            schema:
              type: integer
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  title:
                    type: string
                    description: The updated title of the TODO item
                    example: "Updated Task"
                  completed:
                    type: boolean
                    description: The updated completion status
                    example: True
                  description:
                    type: text
                    description: The detailed description of the TODO task
                    example: "This has been completed."
                  priority:
                    type: integer
                    description: Indication of priority of the TODO task (e.g., 1 for high, 2 for medium, 3 for low)
                    example: 2
        responses:
          200:
            description: The updated TODO item
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    id:
                      type: integer
                      description: The TODO item's ID
                    title:
                      type: string
                      description: The title of the TODO item
                    completed:
                      type: boolean
                      description: Completion status of the TODO item
                    description:
                      type: text
                      description: The detailed description of the TODO task
                    priority:
                      type: integer
                      description: Indication of priority of the TODO task (e.g., 1 for high, 2 for medium, 3 for low)
          404:
            description: TODO item not found
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: "ToDo item not found"
          422:
            description: Bad request, title, completed, description, and/or priority failed validation
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: "Title cannot be empty", "Description cannot be empty", "Completed must be a boolean value.", "Priority must be between 1 and 3"
        """
        with db.session() as session:
            todo = session.get(ToDo, id)
            if todo is None:
                abort(404)
            data = request.get_json() or {}

            # Update properties of ToDo with request body params
            # If params are nonexistent, then `get` method leverages ToDo record's current value with fallback arg
            try:
              todo.title = data.get('title', todo.title)
              todo.completed = data.get('completed', todo.completed)
              todo.description = data.get('description', todo.description)
              todo.priority = data.get('priority', todo.priority)
              session.commit()
              return jsonify(todo.to_dict())
            # If validations fail, then process the failure as 422 response
            except ValueError as e:
              return jsonify({'error': str(e)}), 422
            # Server Error
            except Exception as e:
              abort(500)

    # DESTROY route
    @app.route('/todos/<int:id>', methods=['DELETE'])
    def delete_todo(id):
        """
        Delete a TODO item by ID.
        ---
        parameters:
          - name: id
            in: path
            required: true
            description: The TODO item's ID
            schema:
              type: integer
        responses:
          200:
            description: Confirmation message
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
                      example: "ToDo item deleted"
          404:
            description: TODO item not found
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: "ToDo item not found"
        """
        with db.session() as session:
            # Retrieve the relevant ToDo from the database session
            todo = session.get(ToDo, id)
            # If the ToDo does not exist based off the wildcard, then return a 404
            if todo is None:
                abort(404)
            # Delete the ToDo from the database session
            session.delete(todo)
            # Commit the transaction
            session.commit()
            # Return a successful deletion message
            return jsonify({'message': 'ToDo item deleted'})
