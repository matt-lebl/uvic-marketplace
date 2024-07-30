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


def data_layer_failed(response_from_data_layer, response_to_client):
    if response_from_data_layer.status_code != 200:
        response_to_client.status_code = response_from_data_layer.status_code
        return True
    return False
