"""empty message

Revision ID: fd5451ab0da1
Revises: 241e349a8c18
Create Date: 2020-01-13 00:00:38.476322

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fd5451ab0da1'
down_revision = '241e349a8c18'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('todolists', 'name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('todos', 'list_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('todos', 'list_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('todolists', 'name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###