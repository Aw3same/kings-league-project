
import { Hono } from 'hono'
import leaderboard from '../db/leaderboard.json'


const app = new Hono()

app.get('/', (context) => context.json([
	{
		endpoint: '/leaderboard',
		description: 'Returns the leaderboard'
	}
]))
app.get('/leaderboard', (c) => c.json(leaderboard))

export default app


