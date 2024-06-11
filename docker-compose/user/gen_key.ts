const key = await crypto.subtle.generateKey(
	{ name: 'HMAC', hash: 'SHA-512' },
	true,
	['sign', 'verify']
)
const exported = await crypto.subtle.exportKey('jwk', key)
const encoder = new TextEncoder()
const data = encoder.encode(JSON.stringify(exported))
Deno.mkdir('./src/secret', {
	recursive: true,
})
Deno.writeFile('./src/secret/key.private', data)

