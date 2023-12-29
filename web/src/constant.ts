export const mainUrl = /* process.env.BE_URL  || "http://localhost:8080" */
    process.env.NODE_ENV === "production"
        ? "https://angels-miss-well-ted.trycloudflare.com"
        : "http://angels-miss-well-ted.trycloudflare.com"
export const graphqlUrl = `${mainUrl}:8080/api/graphql/`
export const UploadUrl = `${mainUrl}/save`