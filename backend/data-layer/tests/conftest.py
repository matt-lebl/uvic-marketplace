import sys
import os

# Add root directory
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))

# Add 'backend/data-layer' directory to PYTHONPATH
sys.path.insert(0, os.path.join(root_dir, 'backend', 'data-layer'))

# Add 'backend/data-layer/app' directory to PYTHONPATH
sys.path.insert(0, os.path.join(root_dir, 'backend', 'data-layer', 'app'))
