import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const STATIC_PATHS = path.join(process.cwd(), './assets/static/presidents/')
const DB_PATH = path.join(process.cwd(), './db/')
const RAW_PRESIDENTS = await readFile(`${DB_PATH}/raw-presidents.json`, 'utf-8').then(JSON.parse)

const presidents = await Promise.all(
	RAW_PRESIDENTS.map(async (presidentInfo) => {
		const { slug: id, title, _links: links } = presidentInfo
		const { rendered: name } = title

		const { 'wp:attachment': attachment } = links
		const { href: imageApiEndopoint } = attachment[0]

		console.log(`> Fetching attachment for president : ${name}`)

		const response = await fetch(imageApiEndopoint)
		const data = await response.json()
		const [imageInfo] = data
		const {
			guid: { rendered: imageUrl }
		} = imageInfo
		const fileExtension = imageUrl.split('.').at(-1)

		console.log(`> Fetching iamge for president : ${name}`)

		// fetch the image and save it to the file system
		const responseImage = await fetch(imageUrl)
		const arrayBuffer = await responseImage.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		console.log(`> Writting image to disk ${name}`)

		const imageFileName = `${id}.${fileExtension}`
		await writeFile(`${STATIC_PATHS}/${imageFileName}`, buffer)

		console.log(`> All done! ${name}`)

		return { id, name, image: imageFileName, teamId: 0 }
	})
)
console.log('> All presidents are done')
await writeFile(`${DB_PATH}/presidents.json`, JSON.stringify(presidents, null, 2, 'utf-8'))
