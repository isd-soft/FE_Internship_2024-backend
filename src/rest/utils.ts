import {ValidationError} from "sequelize";


export function formatGenericErrorMessage(error: Error) {
    let message: string = '';
    if (error instanceof ValidationError) {
        for (const validationItem of error.errors) {
            message += validationItem.message + ', '
        }
    } else {
        message = error.toString();
    }
    return message;
}
