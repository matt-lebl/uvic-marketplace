import os
from pytest import fixture

# TODO: This may be the way of giving our tests environment variables (sensitive info)
# @fixture(scope="module")
# def gmail_info_from_env():
#     return [os.environ.get('USERNAME'), os.environ.get('PASSWORD')]
