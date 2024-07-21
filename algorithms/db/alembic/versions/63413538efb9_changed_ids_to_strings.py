"""changed ids to strings

Revision ID: 63413538efb9
Revises: 3d60b38e7bee
Create Date: 2024-07-19 00:57:54.974624

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '63413538efb9'
down_revision: Union[str, None] = '3d60b38e7bee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop foreign key constraints
    op.drop_constraint('interactions_user_id_fkey', 'interactions', type_='foreignkey')
    op.drop_constraint('interactions_listing_id_fkey', 'interactions', type_='foreignkey')
    
    # Alter columns to String
    op.alter_column('interactions', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('interactions', 'listing_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.drop_index('idx_user_listing', table_name='interactions')
    op.create_index('idx_user_listing', 'interactions', ['user_id', 'listing_id'], unique=False)
    op.alter_column('listings', 'listing_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False)
    op.drop_index('ix_listings_listing_id', table_name='listings')
    op.create_index(op.f('ix_listings_listing_id'), 'listings', ['listing_id'], unique=False)
    op.alter_column('users', 'user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=False,
               existing_server_default=sa.text("nextval('users_user_id_seq'::regclass)"))
    op.drop_index('ix_users_user_id', table_name='users')
    op.create_index(op.f('ix_users_user_id'), 'users', ['user_id'], unique=False)

    # Recreate foreign key constraints
    op.create_foreign_key('interactions_user_id_fkey', 'interactions', 'users', ['user_id'], ['user_id'])
    op.create_foreign_key('interactions_listing_id_fkey', 'interactions', 'listings', ['listing_id'], ['listing_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # Drop foreign key constraints
    op.drop_constraint('interactions_user_id_fkey', 'interactions', type_='foreignkey')
    op.drop_constraint('interactions_listing_id_fkey', 'interactions', type_='foreignkey')

    # Revert columns to Integer
    op.drop_index(op.f('ix_users_user_id'), table_name='users')
    op.create_index('ix_users_user_id', 'users', ['user_id'], unique=True)
    op.alter_column('users', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False,
               existing_server_default=sa.text("nextval('users_user_id_seq'::regclass)"))
    op.drop_index(op.f('ix_listings_listing_id'), table_name='listings')
    op.create_index('ix_listings_listing_id', 'listings', ['listing_id'], unique=True)
    op.alter_column('listings', 'listing_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.drop_index('idx_user_listing', table_name='interactions')
    op.create_index('idx_user_listing', 'interactions', ['user_id', 'listing_id'], unique=True)
    op.alter_column('interactions', 'listing_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)
    op.alter_column('interactions', 'user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=False)

    # Recreate foreign key constraints
    op.create_foreign_key('interactions_user_id_fkey', 'interactions', 'users', ['user_id'], ['user_id'])
    op.create_foreign_key('interactions_listing_id_fkey', 'interactions', 'listings', ['listing_id'], ['listing_id'])
    # ### end Alembic commands ###
