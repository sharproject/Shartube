import { GraphQLError } from "graphql"

export class UnauthorizedError extends GraphQLError {
    constructor() {
        super('You are not authorized to access this resource',
            {
                extensions: {
                    code: 'Unauthorized',
                }
            })
    }
}

export class ServerError extends GraphQLError {
    constructor() {
        super("Server Error", {
            extensions: {
                code: "ServerError"
            }
        })
    }
}

export class BadRequest extends GraphQLError {
    constructor(message: string = "Bad Request") {
        super(message, {
            extensions: {
                code: "BAD_REQUEST"
            }
        })
    }
}

export class NotFound extends GraphQLError{
    constructor(message: string = "Not Found") {
        super(message, {
            extensions: {
                code: "NOT_FOUND"
            }
        })
    }
}