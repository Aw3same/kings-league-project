import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'

describe('Worker', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    worker = await unstable_dev('api/index.ts', {
      experimental: { disableExperimentalWarning: true }
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  it('should return Hello World', async () => {
    const resp = await worker.fetch()
    if (resp) {
		const apiRoutes = await resp.json()
		// verify the response to have the expected format
		apiRoutes.forEach((endpoint) => {
		  expect(endpoint).toHaveProperty('endpoint')
		  expect(endpoint).toHaveProperty('description')
		})
  
    }
  })
})
