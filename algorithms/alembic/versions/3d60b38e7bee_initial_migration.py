"""Initial migration

Revision ID: 3d60b38e7bee
Revises: 
Create Date: 2024-06-07 14:30:08.936202

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3d60b38e7bee'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('listings',
    sa.Column('listing_id', sa.Integer(), nullable=False),
    sa.Column('listing_name', sa.String(), nullable=True),
    sa.Column('elasticsearch_id', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('listing_id'),
    sa.UniqueConstraint('elasticsearch_id')
    )
    op.create_index(op.f('ix_listings_listing_id'), 'listings', ['listing_id'], unique=False)
    op.create_index(op.f('ix_listings_listing_name'), 'listings', ['listing_name'], unique=True)
    op.create_table('users',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('user_name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('user_id')
    )
    op.create_index(op.f('ix_users_user_id'), 'users', ['user_id'], unique=False)
    op.create_index(op.f('ix_users_user_name'), 'users', ['user_name'], unique=True)
    op.create_table('interactions',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('listing_id', sa.Integer(), nullable=False),
    sa.Column('interaction_count', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['listing_id'], ['listings.listing_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('user_id', 'listing_id')
    )
    op.create_index('idx_user_listing', 'interactions', ['user_id', 'listing_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('idx_user_listing', table_name='interactions')
    op.drop_table('interactions')
    op.drop_index(op.f('ix_users_user_name'), table_name='users')
    op.drop_index(op.f('ix_users_user_id'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_listings_listing_name'), table_name='listings')
    op.drop_index(op.f('ix_listings_listing_id'), table_name='listings')
    op.drop_table('listings')
    # ### end Alembic commands ###
