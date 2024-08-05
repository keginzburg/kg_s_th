# sys provides access to some variables used or maintained by the Python interpreter
import sys
# os provides a way of using OS-dependent functionality
import os

# Add the project root to the PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Sets up the Python environment to ensure that the backend's root directory is included in the Python import search path.
# Any imports in your test files can correctly find the modules and packages located in the root directory or its subdirectories.
# Highly useful for avoiding pesky import errors.