import * as cheerio from 'cheerio'

export const URLS = {
	leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
	teams: 'https://kingsleague.pro/wp-json/wp/v2/teams',
	players: 'https://kingsleague.pro/wp-json/wp/v2/playerteams',
	matches: 'https://kingsleague.pro/wp-json/wp/v2/matches',
	mvp: 'https://kingsleague.pro/estadisticas/mvp/',
	coachs: 'https://es.besoccer.com/competicion/info/kings-league/2023'

}

export const cleanText = (text) =>
text
	.replace(/\t|\n|\s:/g, '')
	.replace(/.*:/g, ' ')
	.trim()


export async function scrape(url) {
	const res = await fetch(url)
	const html = await res.text()
	return cheerio.load(html)
}


