"""Extend ToDo model to include description and priority

Revision ID: 0caf3bb66ec7
Revises: f9f480707446
Create Date: 2024-08-02 15:16:24.130587

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0caf3bb66ec7'
down_revision = 'f9f480707446'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('to_do', schema=None) as batch_op:
        batch_op.add_column(sa.Column('description', sa.Text(), nullable=False))
        batch_op.add_column(sa.Column('priority', sa.Integer(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('to_do', schema=None) as batch_op:
        batch_op.drop_column('priority')
        batch_op.drop_column('description')

    # ### end Alembic commands ###