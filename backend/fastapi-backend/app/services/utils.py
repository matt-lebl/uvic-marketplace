from fastapi import HTTPException


def convert_to_type(data, type):
    try:
        return type(**data)
    except Exception as e:
        return HTTPException(
            status_code=500,
            detail="Error in converting data - internal backend error - please report this error to the developers."
            + str(e),
        )
