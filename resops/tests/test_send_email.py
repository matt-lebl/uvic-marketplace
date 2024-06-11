import pytest

# File under test:
import app.email.send_email as send_email

# TODO: Decide whether or not this should be held within a Test class or not.
# class TestSendEmail:
#     # TODO: could create an Email class.
#     email = None 

@pytest.fixture
def email_gen():
    # TODO: extract emails + password into something like a .env file, for security purposes.
    new_email = ["[TEST] Test Email",
        "Example text for test email.",
        "[INSERT GMAIL HERE]",
        "[EMAIL 1]",
        "[PASSWORD]"
    ]

    return new_email

def test_deliver_email_sent(email_gen):
    assert send_email.deliver_email(*email_gen) == 200


def test_deliver_email_invalid_request(email_gen):
    assert send_email.deliver_email(*email_gen) == 400


def test_deliver_email_server_error(email_gen):
    assert send_email.deliver_email(*email_gen) == 500
