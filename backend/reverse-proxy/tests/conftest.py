import sys
import os

# Add root directory
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))

# Add 'backend/reverse-proxy' directory to PYTHONPATH
sys.path.insert(0, os.path.join(root_dir, 'backend', 'reverse-proxy'))

# Add 'backend/reverse-proxy/app' directory to PYTHONPATH
sys.path.insert(0, os.path.join(root_dir, 'backend', 'reverse-proxy', 'app'))
