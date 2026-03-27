// eslint-disable-next-line @typescript-eslint/no-var-requires
const { webcrypto } = require('crypto')
if (!globalThis.crypto) {
    globalThis.crypto = webcrypto
}
