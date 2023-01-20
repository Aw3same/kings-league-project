import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import presidents from '../db/presidents.json'
import teams from '../db/teams.json'
import coaches from '../db/coaches.json'
import mvp from '../db/mvp.json'

const app = new Hono()

app.get('/', (context) =>
	context.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns the leaderboard'
		},
		{
			endpoint: '/teams',
			description: 'Returns the teams'
		},
		{
			endpoint: '/presidents',
			description: 'Returns the presidents'
		},
		{
			endpoint: '/coaches',
			description: 'Returns Kings League coaches'
		},
		{
			endpoint: '/mvp',
			description: 'Returns Kings League MVP'
		}
	])
)

app.get('/leaderboard', (c) => c.json(leaderboard))

app.get('/presidents', (c) => c.json(presidents))
app.get('/presidents/:id', (c) => {
	const id = c.req.param('id')
	const foundPresident = presidents.find((president) => president.id === id)
	return foundPresident ? c.json(foundPresident) : c.json({ message: 'President not found' }, 404)
})
app.get('/teams', (c) => c.json(teams))
app.get('/teams/:id', (c) => {
	const id = c.req.param('id')
	const foundTeam = teams.find((team) => team.id === id)
	return foundTeam ? c.json(foundTeam) : c.json({ message: 'Team not found' }, 404)
})

app.get('/coaches', (c) => c.json(coaches))

app.get('/mvp', (c) => c.json(mvp))

app.get('/static/*', serveStatic({ root: './' }))

app.notFound((c) => {
	const { pathname } = new URL(c.req.url)

	if (c.req.url.at(-1) === '/') {
		return c.redirect(pathname.slice(0, -1))
	}

	return c.json({ message: 'Not Found' }, 404)
})

export default app
