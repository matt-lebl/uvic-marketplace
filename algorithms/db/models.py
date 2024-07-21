from sqlalchemy import Column, Integer, String, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DB_User(Base):
    __tablename__ = 'users'
    user_id = Column(String, primary_key=True, index=True)
    user_name = Column(String, index=True)

class DB_Listing(Base):
    __tablename__ = 'listings'
    listing_id = Column(String, primary_key=True, index=True)
    listing_name = Column(String, index=True)
    elasticsearch_id = Column(String, unique=True)

class DB_Interaction(Base):
    __tablename__ = 'interactions'
    user_id = Column(String, ForeignKey('users.user_id'), primary_key=True)
    listing_id = Column(String, ForeignKey('listings.listing_id'), primary_key=True)
    interaction_count = Column(Integer, default=0)
    __table_args__ = (
        Index('idx_user_listing', 'user_id', 'listing_id'),
    )
