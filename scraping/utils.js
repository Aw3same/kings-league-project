import * as cheerio from 'cheerio'
import { writeDBFile } from '../db/index.js'
import { getAssists } from './assists.js'
import { getLeaderBoard } from './leaderboard.js'
import { logError, logInfo, logSuccess } from './log.js'
import { getMvp } from './mvp.js'
import { getTopScoresList } from './top_scorers.js'

export const URLS = {
	leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
	teams: 'https://kingsleague.pro/wp-json/wp/v2/teams',
	players: 'https://kingsleague.pro/wp-json/wp/v2/playerteams',
	matches: 'https://kingsleague.pro/wp-json/wp/v2/matches',
	mvp: 'https://kingsleague.pro/estadisticas/mvp/',
	coachs: 'https://es.besoccer.com/competicion/info/kings-league/2023'
}

export const SCRAPINGS = {
	leaderboard: {
		url: 'https://kingsleague.pro/estadisticas/clasificacion/',
		scraper: getLeaderBoard
	},
	mvp: {
		url: 'https://kingsleague.pro/estadisticas/mvp/',
		scraper: getMvp
	},
	top_scorers: {
		url: 'https://kingsleague.pro/estadisticas/goles/',
		scraper: getTopScoresList
	},
	top_assists: {
		url: 'https://kingsleague.pro/estadisticas/asistencias/',
		scraper: getAssists
	}
	// players_twelve: {
	// 	url: 'https://kingsleague.pro/jugador-12/',
	// 	scraper: getPlayersTwelve
	// },
	// schedule: {
	// 	url: 'https://kingsleague.pro/calendario/',
	// 	scraper: getSchedule
	// },
	// top_statistics: {
	// 	scraper: getTopStatistics
	// }
	// coaches: {
	// 	url: 'https://es.besoccer.com/competicion/info/kings-league/2023',
	// 	scraper: getCoaches
	// }
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

export async function scrapeAndSave(name) {
	const start = performance.now()

	try {
		const { scraper, url } = SCRAPINGS[name]

		logInfo(`Scraping [${name}]...`)
		const $ = url ? await scrape(url) : null
		const content = await scraper($)
		logSuccess(`[${name}] scraped successfully`)

		logInfo(`Writing [${name}] to database...`)
		await writeDBFile(name, content)
		logSuccess(`[${name}] written successfully`)
	} catch (e) {
		logError(`Error scraping [${name}]`)
		logError(e)
	} finally {
		const end = performance.now()
		const time = (end - start) / 1000
		logInfo(`[${name}] scraped in ${time} seconds`)
	}
}
