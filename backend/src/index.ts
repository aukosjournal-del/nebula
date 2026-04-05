import 'dotenv/config'
import { createApp } from './app'
import { env } from './config/env'

async function start() {
  const app = createApp()

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`\n🚀 Lumina API → http://localhost:${env.PORT}`)
    console.log(`📊 Health check → http://localhost:${env.PORT}/health\n`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
