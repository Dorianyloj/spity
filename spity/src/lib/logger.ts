type LogContext = Record<string, unknown>
type LogLevel = 'error' | 'info' | 'warn'

const write = (level: LogLevel, event: string, context: LogContext = {}) => {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...context,
  })

  if (level === 'error') {
    console.error(entry)
    return
  }

  if (level === 'warn') {
    console.warn(entry)
    return
  }

  console.info(entry)
}

export const logger = {
  error: (event: string, context?: LogContext) => write('error', event, context),
  info: (event: string, context?: LogContext) => write('info', event, context),
  warn: (event: string, context?: LogContext) => write('warn', event, context),
}
