const maxBodyBytes = 16_384

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(body))
}

function field(value, maxLength = 200) {
  return typeof value === 'string' && value.trim().length <= maxLength ? value.trim().replace(/\s+/g, ' ') : null
}

export async function handleCallback(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Method not allowed.' })
    return
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    sendJson(response, 503, { error: 'Call-back requests are not configured yet.' })
    return
  }

  let body = ''
  try {
    for await (const chunk of request) {
      body += chunk
      if (Buffer.byteLength(body) > maxBodyBytes) {
        sendJson(response, 413, { error: 'Request is too large.' })
        return
      }
    }

    let input
    try {
      input = JSON.parse(body)
    } catch {
      sendJson(response, 400, { error: 'Invalid request.' })
      return
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      sendJson(response, 400, { error: 'Invalid request.' })
      return
    }
    const required = ['medication', 'fullName', 'phone', 'email', 'time', 'street', 'city', 'state', 'zip', 'payment', 'prescription']
    const data = Object.fromEntries([...required, 'unit', 'bank'].map((key) => [key, field(input[key] ?? '')]))
    if (required.some((key) => !data[key]) || Object.values(data).some((value) => value === null)) {
      sendJson(response, 400, { error: 'Please complete all required fields.' })
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email) || data.phone.replace(/\D/g, '').length !== 10 || !/^\d{5}(-?\d{4})?$/.test(data.zip)) {
      sendJson(response, 400, { error: 'Please check your contact and ZIP code.' })
      return
    }
    if (data.payment !== 'Insurance + copay' && !data.bank) {
      sendJson(response, 400, { error: 'Please enter your bank name.' })
      return
    }

    const labels = {
      medication: 'Medication', fullName: 'Name', phone: 'Phone', email: 'Email', time: 'Best time (ET)',
      street: 'Street', unit: 'Unit', city: 'City', state: 'State', zip: 'ZIP', payment: 'Payment preference',
      bank: 'Bank', prescription: 'Prescription',
    }
    const message = ['New call-back request', ...Object.entries(labels)
      .filter(([key]) => data[key])
      .map(([key, label]) => `${label}: ${data[key]}`)].join('\n')

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!telegramResponse.ok || !(await telegramResponse.json()).ok) {
      sendJson(response, 502, { error: 'We could not send your request. Please try again.' })
      return
    }
    sendJson(response, 200, { ok: true })
  } catch {
    if (!response.writableEnded) sendJson(response, 502, { error: 'We could not send your request. Please try again.' })
  }
}
