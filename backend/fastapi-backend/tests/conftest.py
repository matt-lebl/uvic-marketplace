import sys
import os

# Add root directory
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))

# Add 'backend/fastapi-backend' directory to PYTHONPATH
sys.path.insert(0, os.path.join(root_dir, 'backend', 'fastapi-backend'))

# Add 'backend/fastapi-backend/app' directory to PYTHONPATH
sys.path.insert(0, os.path.join(root_dir, 'backend', 'fastapi-backend', 'app'))

