import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'


const app = new Hono()

app.get('/', (context) => context.json([
	{
		endpoint: '/leaderboard',
		description: 'Returns the leaderboard'
	}
]))
app.get('/leaderboard', (c) => c.json(leaderboard))

app.get('/static/*', serveStatic({ root: './'}))

export default app


