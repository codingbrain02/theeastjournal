import assert from 'node:assert/strict'
import { createServer, request as httpRequest } from 'node:http'
import { after, before, test } from 'node:test'
import { handleCallback } from './telegram.js'

let server
let port
const originalFetch = globalThis.fetch
const originalToken = process.env.TELEGRAM_BOT_TOKEN
const originalChat = process.env.TELEGRAM_CHAT_ID

before(async () => {
  server = createServer(handleCallback)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  port = server.address().port
})

after(async () => {
  globalThis.fetch = originalFetch
  if (originalToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN
  else process.env.TELEGRAM_BOT_TOKEN = originalToken
  if (originalChat === undefined) delete process.env.TELEGRAM_CHAT_ID
  else process.env.TELEGRAM_CHAT_ID = originalChat
  await new Promise((resolve) => server.close(resolve))
})

function post(body) {
  return new Promise((resolve, reject) => {
    const request = httpRequest({ host: '127.0.0.1', port, path: '/api/callback', method: 'POST', headers: { 'Content-Type': 'application/json' } }, (response) => {
      let text = ''
      response.on('data', (chunk) => { text += chunk })
      response.on('end', () => resolve({ status: response.statusCode, body: JSON.parse(text) }))
    })
    request.on('error', reject)
    request.end(JSON.stringify(body))
  })
}

const validRequest = {
  medication: 'Lacosamide', fullName: 'Test Person', phone: '2125551234', email: 'test@example.com',
  time: 'morning', street: '123 Main St', unit: '', city: 'New York', state: 'New York', zip: '10001',
  payment: 'Insurance + copay', bank: '', prescription: 'Not yet, I have a question',
}

test('sends a valid request to the configured Telegram chat', async () => {
  process.env.TELEGRAM_BOT_TOKEN = 'test-token'
  process.env.TELEGRAM_CHAT_ID = '12345'
  let sent
  globalThis.fetch = async (url, options) => {
    sent = { url, ...JSON.parse(options.body) }
    return { ok: true, json: async () => ({ ok: true }) }
  }

  assert.deepEqual(await post(validRequest), { status: 200, body: { ok: true } })
  assert.equal(sent.url, 'https://api.telegram.org/bottest-token/sendMessage')
  assert.equal(sent.chat_id, '12345')
  assert.match(sent.text, /Name: Test Person/)
  assert.match(sent.text, /Medication: Lacosamide/)
})

test('rejects invalid fields before sending', async () => {
  globalThis.fetch = () => { throw new Error('should not send') }
  const result = await post({ ...validRequest, phone: '123' })
  assert.equal(result.status, 400)
})

test('does not report success when Telegram rejects the request', async () => {
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ ok: false }) })
  const result = await post(validRequest)
  assert.equal(result.status, 502)
})
