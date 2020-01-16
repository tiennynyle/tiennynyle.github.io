"""empty message

Revision ID: 6b14966bac42
Revises: 
Create Date: 2020-01-11 20:48:54.521087

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b14966bac42'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('todos', sa.Column('completed', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###
    op.execute('UPDATE todos SET completed = FALSE where completed is NULL;')
    op.alter_column('todos','completed',nullable = False)

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('todos', 'completed')
    # ### end Alembic commands ###
