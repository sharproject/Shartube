import { ExpressContextFunctionArgument } from "@apollo/server/express4"

interface RequestType {
    headers: {
        get: (name: string) => string | string[] | undefined
    }
}
export type ParseGraphqlContextResult = {
    request: RequestType
}
export async function ParseGraphqlContext(input: ExpressContextFunctionArgument): Promise<ParseGraphqlContextResult> {

    const request: RequestType = {
        headers: {
            get(name) {
                return input.req.headers[name]
            },
        }
    }
    return { request }
}