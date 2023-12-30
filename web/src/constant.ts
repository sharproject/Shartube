export const mainUrl = /* process.env.BE_URL  || "http://localhost:8080" */
    process.env.NODE_ENV === "production"
        ? "https://angels-miss-well-ted.trycloudflare.com"
        : "http://localhost:8080"
export const graphqlUrl = `${mainUrl}/api/graphql/`
export const UploadUrl = `${mainUrl}/save`