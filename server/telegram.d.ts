import type { IncomingMessage, ServerResponse } from 'node:http'

export function handleCallback(request: IncomingMessage, response: ServerResponse): Promise<void>
