import smtplib
from email.mime.text import MIMEText

# Config values:
smtp_port = 465


def send(subject, body, sender, recievers, password):
    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = ", ".join(recievers)

    with smtplib.SMTP_SSL("smtp.gmail.com", smtp_port) as smtp_server:
        smtp_server.login(sender, password)
        smtp_server.sendmail(sender, recievers, message.as_string())

    print("Message sent to " + message["To"])
