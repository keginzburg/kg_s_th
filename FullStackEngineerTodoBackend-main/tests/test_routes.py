import pytest
from app import create_app, db
from app.models import ToDo

# Defines a pytest fixture that sets up and configures Flask app for testing purposes.

# Decorator marks the app function as a fixture.
@pytest.fixture
def app():
    # Define test-specific configuration
    # Using in-memory SQLite database (useful for testing as its fast and isolated from other tests)
    test_config = {
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'
    }
    # Initialization of the Flask application with the specified test configuration.
    app = create_app(config=test_config)

    # Pushes an application context for app-specific data like config and db sessions
    with app.app_context():
        # Creates all database tables defined in the models
        db.create_all()  # Create tables
        # Provides app instance to test functions (where test execution occurs)
        yield app
        # Removes the database session (ensures no lingering connections or transactions for subsequent tests)
        db.session.remove()
        # Clears all database tables so db is clean and ready for next test
        clear_tables()  # Clear tables

# Decorator marks the client function as a fixture.
@pytest.fixture
# Creates a test client for the Flask app, which can be used to mimic a real client-server interation
def client(app):
    return app.test_client()

# Decorator marks the populate_todos function as a fixture
@pytest.fixture
# Populates the test db with ToDo items for testing purposes
def populate_todos(app):
    # Pushes an application context for app-specific data like config and db sessions
    with app.app_context():
        # Creation of ToDo list
        todos = [
            ToDo(title='First Todo', description='This is the 1st ToDo', priority=1),
            ToDo(title='Second Todo', completed=True, description='This is the 2nd ToDo', priority=2),
            ToDo(title='Third Todo', description='This is the 3rd ToDo', priority=3)
        ]
        # db session uses baked-in bulk_save_objects method to add all the ToDo objects to the session in a single operation.
        # Useful for testing (and could be useful for seeding)
        db.session.bulk_save_objects(todos)
        # Commits the transaction, persisting changes
        db.session.commit()

# Helper function leveraged above to clear all tables in db
def clear_tables():
    """Clear all tables in the database."""
    # SQLAlchemy interaction with db; provides session object for managing database session
    with db.session() as session:
        # Iteration over all tables in db metadata (sorted by their dependencies)
        for table in reversed(db.metadata.sorted_tables):
            # Deletion of each table in iteration
            session.execute(table.delete())
        # Commits the transaction
        session.commit()

def test_get_todos_no_items(client):
    response = client.get('/todos')
    assert response.status_code == 200
    assert response.json == []

def test_get_todos_with_items(client, populate_todos):
    response = client.get('/todos')
    assert response.status_code == 200
    data = response.json
    assert len(data) == 3
    titles = [todo['title'] for todo in data]
    assert 'First Todo' in titles
    assert 'Second Todo' in titles
    assert 'Third Todo' in titles

def test_create_todo_success(client):
    # Addition of description and priority fields in this test
    response = client.post('/todos', json={'title': 'Test Todo', 'description': 'This is a test ToDo', 'priority': 1})
    assert response.status_code == 201
    data = response.json
    assert 'id' in data
    assert data['title'] == 'Test Todo'
    assert data['completed'] == False
    # Addition of two assertions for description and priority fields in this test
    assert data['description'] == 'This is a test ToDo'
    assert data['priority'] == 1

def test_create_todo_missing_title(client):
    # Addition of description and priority fields in this test
    response = client.post('/todos', json={'description': 'This ToDo is missing its title', 'priority': 3})
    assert response.status_code == 400
    assert b'Title is required' in response.data

def test_update_todo_success(client):
    # Addition of description and priority fields in this test
    response = client.post('/todos', json={'title': 'Update Test Todo', 'description': 'This ToDo will be updated', 'priority': 1})
    assert response.status_code == 201
    todo_id = response.json['id']

    response = client.put(f'/todos/{todo_id}', json={'title': 'Updated Title', 'completed': True })
    assert response.status_code == 200
    data = response.json
    assert data['title'] == 'Updated Title'
    assert data['completed'] == True

def test_update_todo_not_found(client):
    response = client.put('/todos/9999', json={'title': 'Non-existent'})
    assert response.status_code == 404

def test_delete_todo_success(client):
    # Addition of description and priority fields in this test
    response = client.post('/todos', json={'title': 'Delete Test Todo', 'description': 'This will be deleted.', 'priority': 1})
    assert response.status_code == 201
    todo_id = response.json['id']

    response = client.delete(f'/todos/{todo_id}')
    assert response.status_code == 200
    assert b'ToDo item deleted' in response.data

    response = client.get('/todos')
    assert response.status_code == 200
    assert all(todo['id'] != todo_id for todo in response.json)

def test_delete_todo_not_found(client):
    response = client.delete('/todos/9999')
    assert response.status_code == 404

# Additional Testing for ToDo Model Validations
def test_todo_title_validations(client):
    response = client.post('/todos', json={'title': '', 'description': 'This ToDo has a title longer than 128 characters', 'priority': 3})
    assert response.status_code == 422
    assert b'Title cannot be empty' in response.data

    response = client.post('/todos', json={'title': 'Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong title', 'description': 'This ToDo has an empty title', 'priority': 3})
    assert response.status_code == 422
    assert b'Title cannot exceed 128 characters' in response.data

def test_todo_completed_validation(client):
    response = client.post('/todos', json={'title': 'Update Test Todo', 'description': 'This ToDo will have a completed status of false by default', 'priority': 1})
    assert response.status_code == 201
    todo_id = response.json['id']

    response = client.put(f'/todos/{todo_id}', json={'completed': 'hello'})
    assert response.status_code == 422
    assert b'Completed must be a boolean value' in response.data

def test_todo_description_validation(client):
    response = client.post('/todos', json={'title': 'This ToDo has an empty description', 'description': '', 'priority': 1})
    assert response.status_code == 422
    assert b'Description cannot be empty' in response.data

def test_todo_priority_validation(client):
    response = client.post('/todos', json={'title': 'Unrecognizable priority', 'description': 'This is missing a valid priority', 'priority': 4})
    assert response.status_code == 422
    assert b'Priority must be between 1 and 3' in response.data