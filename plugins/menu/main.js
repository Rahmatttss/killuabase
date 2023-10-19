import db from '../../lib/database.js'
import { plugins } from '../../lib/plugins.js'
import { readMore, ranNumb, padLead, runtimes } from '../../lib/func.js'
import { promises } from 'fs'
import { join } from 'path'
import moment from 'moment-timezone'
import os from 'os'


let tags = {
	'submenu': '🎪 *SUB MENU*',
	'searching': '🔎 *SEARCHING*',
	'information': '🤖 *INFORMATION*',
	'entertainment': '🎡 *ENTERTAINMENT*',
	'primbon': '🎆 *PRIMBON*',
	'creator': '🖱💻 *CREATOR*',
	'tools': '✏️ *TOOLS MENU*',
}
const defaultMenu = {
	before: `
┏─────────────────⬣
┆ 𝑯𝒂𝒊, *${ucapan()} %name*👋
┗┬──────────────┈ ⳹
┏┆➺ *.owner*
┆┆➺ *.info*
┆┆➺ *.levelup*
┗┬──────────────┈ ⳹
┏┤   *%me*
┆┗──────────────┈ ⳹
┆➺ Nama  : %name!
┆➺ Role : *%role*
┆➺ Limit : *%limit*
┗┬──────────────┈ ⳹
┏┤ *𝐁𝐨𝐭 𝐈𝐧𝐟𝐨*
┆┗──────────────┈ ⳹
┆➺ *Limit :* Ⓛ 
┆➺ *Premium :* Ⓟ
┆➺ *Runtime :* %uptime
┆➺ *OS Uptime :* %osuptime
┆➺ *Penulis Ulang :* ᵈʳкσкσ ᴘᴀ፝֟፝֟ɴɢᴇʀᴀɴ×፝֟͜×
┆➺ *Script Ini :* Private!
┗─────────────────⬣%readmore`.trimStart(),
	header: '╔═❖ %category ❖═══',
	body: '┃➺ %cmd',
	footer: '╚══════════❖\n',
}
let handler = async (m, { conn, usedPrefix: _p, __dirname, isPrems }) => {
	try {
		let meh = padLead(ranNumb(43), 3)
		let nais = await (await fetch('https://raw.githubusercontent.com/clicknetcafe/Databasee/main/azamibot/menus.json')).json().then(v => v.getRandom())
		let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
		let { limit, role } = db.data.users[m.sender]
		let name = await conn.getName(m.sender).replaceAll('\n','')
		let uptime = runtimes(process.uptime())
		let osuptime = runtimes(os.uptime())
		let help = Object.values(plugins).filter(plugin => !plugin.disabled).map(plugin => {
			return {
				help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
				tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
				prefix: 'customPrefix' in plugin,
				limit: plugin.limit,
				premium: plugin.premium,
				enabled: !plugin.disabled,
			}
		})
		const arr = [
"*♡♡♡♡♡♡♡♡ 0%*",
"*❤❤♡♡♡♡♡♡ 20%*",
"*❤❤❤♡♡♡♡♡ 30%*",
"*❤❤❤❤♡♡♡♡ 40%*",
"*❤❤❤❤❤♡♡♡ 60%*",
"*❤❤❤❤❤❤♡♡ 80%*",
"*❤❤❤❤❤❤❤ 100%*",
"~_*©辛KILLUA ZOLDYCK*_~\n𝑳𝑶𝑽𝑬𝑫 𝑪𝑶𝑴𝑷𝑳𝑬𝑻𝑬𝑫...!"
];

const keyMessage = await conn.sendMessage(m.chat, { text: "𝑳𝑶𝑽𝑬𝑫..." });

for (const item of arr) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  await conn.sendMessage(m.chat, { text: item, edit: keyMessage });
}
await delay(1000);

		for (let plugin of help)
			if (plugin && 'tags' in plugin)
				for (let tag of plugin.tags)
					if (!(tag in tags) && tag) tags[tag] = tag
		conn.menu = conn.menu ? conn.menu : {}
		let before = conn.menu.before || defaultMenu.before
		let header = conn.menu.header || defaultMenu.header
		let body = conn.menu.body || defaultMenu.body
		let footer = conn.menu.footer || defaultMenu.footer
		let _text = [
			before.replace(': *%limit', `${isPrems ? ': *Infinity' : ': *%limit'}`),
			...Object.keys(tags).map(tag => {
				return header.replace(/%category/g, tags[tag]) + '\n' + [
					...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
						return menu.help.map(help => {
							return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
								.replace(/%islimit/g, menu.limit ? '(Limit)' : '')
								.replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
								.trim()
						}).join('\n')
					}),
					footer
				].join('\n')
			}),
		].join('\n')
		let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
		let replace = {
			'%': '%',
			p: _p, uptime, osuptime,
			me: conn.getName(conn.user.jid),
			github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
			limit, name, role,
			readmore: readMore
		}
		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
		await conn.sendFThumb(m.chat, db.data.datas.maingroupname, text.trim(), nais, db.data.datas.linkgc, m)
	} catch (e) {
		throw e
	}
}

handler.command = /^((m(enu)?|help)(list)?|\?)$/i

handler.exp = 3

export default handler

function ucapan() {
        const hour_now = moment.tz('Asia/Jakarta').format('HH')
        var ucapanWaktu = 'Ohayou...'
        if (hour_now >= '03' && hour_now <= '10') {
          ucapanWaktu = 'Ohayou...'
        } else if (hour_now >= '10' && hour_now <= '15') {
          ucapanWaktu = 'Konnichiwa...'
        } else if (hour_now >= '15' && hour_now <= '17') {
          ucapanWaktu = 'Konnichiwa...'
        } else if (hour_now >= '17' && hour_now <= '18') {
          ucapanWaktu = 'Konbanwa...'
        } else if (hour_now >= '18' && hour_now <= '23') {
          ucapanWaktu = 'Konbanwa...'
        } else {
          ucapanWaktu = 'Konbanwa'
        }	
        return ucapanWaktu
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}