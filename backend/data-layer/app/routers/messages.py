@app.post("/messages/", response_model=Message)
def create_message(message: MessageBase, session: Session = Depends(get_session)):
    message_data = message.dict()
    message_data["message_id"] = str(uuid.uuid4())
    new_message = Message.create(session=session, **message_data)
    return new_message

@app.get("/messages/", response_model=List[Message])
def get_all_messages(session: Session = Depends(get_session)):
    return Message.get_all(session)

@app.get("/messages/{message_id}", response_model=Message)
def get_message(message_id: str, session: Session = Depends(get_session)):
    message = Message.get_by_id(session, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message
