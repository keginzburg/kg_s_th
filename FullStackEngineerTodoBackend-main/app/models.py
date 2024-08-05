from app import db
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates

class ToDo(db.Model):
    # ToDo Model migration columns and types
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    # Addition of description and priority columns
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.Integer, nullable=False)

    # Addition of database constraints to ensure
    # - the value of priority column can only be 1, 2, or 3
    # - the length of title column is maxed at 128 characters
    # - the value of completed is a boolean entry
    __table_args__ = (
        CheckConstraint('priority IN (1, 2, 3)', name='check_priority'),
        CheckConstraint('length(title) <= 128', name='check_title_length'),
        CheckConstraint('completed IN (True, False)', name='check_completed'),
    )

    # Validations
    @validates('title')
    def validate_title(self, key, value):
        if not value:
            raise ValueError("Title cannot be empty")
        if len(value) > 128:
            raise ValueError("Title cannot exceed 128 characters")
        return value

    @validates('completed')
    def validate_completed(self, key, value):
        if value not in [True, False]:
            raise ValueError("Completed must be a boolean value")
        return value

    @validates('description')
    def validate_description(self, key, value):
        if not value:
            raise ValueError("Description cannot be empty")
        return value

    @validates('priority')
    def validate_priority(self, key, value):
        if value not in [1, 2, 3]:
            raise ValueError("Priority must be between 1 and 3")
        return value

    # Convenience method for JSON serialization in response
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'completed': self.completed,
            'description': self.description,
            'priority': self.priority
        }
