import Gamedig from 'gamedig'
import TelegramBot from "node-telegram-bot-api"


// SERVER SETUP
const SERVER_IP = '127.0.0.1'
const SERVER_PORT = '27015'
const SERVER_TYPE = 'cs16' // counter-stike 1.6
const BOT_ROKEN = ''



const bot = new TelegramBot(BOT_ROKEN, { polling: true })

let IS_READY = true
setInterval(() => IS_READY = true, 120000)

const ANSWERS = [
	'Ты недооцениваешь себя. Ты можешь ещё хуже! 💩',
	'Быть гением в нашем мире - тяжкое бремя. Хорошо, что {name} не обременён',
	'{name}, твой скрытый талант на столько прекрасен, что его нужно скрывать вечно',
	'{name}, у тебя есть талант, не верь никому, кто так говорит',
	'Когда один парень, борющийся за жизнь со смертельной болезнью, познакомился с {name}, он нашёл в себе силы прекратить борьбу...',
	'{name} один из немногих кто заслуживает унижения',
	'{name}, спасибо за счастливое детство. В детстве мы о тебе не знали))',
	'Всегда задавался вопросом, почему столько хейта в сторону {name}? Его должно быть в десятки раз больше!',
	'Если вы не считаете что {name} реальный кринж, то скорее всего вы {name}',
]

bot.on('message', async (msg) => {
	if (msg.left_chat_member || msg.new_chat_members) return

	if (msg.reply_to_message && msg.reply_to_message.from.is_bot) {
		return bot.sendMessage(msg.chat.id, '🤷')
	}

	if (Array.isArray(msg.entities) && (msg.entities.length && msg.entities[0].type === 'bot_command')) {

		const rand = Math.floor(Math.random() * ANSWERS.length)
		const kek_answer = ANSWERS[rand].replaceAll('{name}', msg.from.first_name || msg.from.username)
		
		return bot.sendMessage(msg.chat.id, kek_answer)
	}

	switch (msg.text) {
		case '.сервер':
			if (!IS_READY) {
				return bot.sendMessage(msg.chat.id, 'Подожди пару минут ...')
			}
			
			try {
				const server = Gamedig.query({
					type: SERVER_TYPE,
					host: SERVER_IP,
					port: SERVER_PORT
				})

				let mess = `🔫 ${server.name} \n`
				mess += `ℹ️ ${server.map} | ${server.raw.numplayers}/${server.maxplayers} \n\n`
				
				server.players.forEach(pl => {
					mess += `🎮 ${pl.name} | фраги ${pl.raw.score} \n`
				})

				bot.sendMessage(msg.chat.id, mess)

				IS_READY = false
			} catch (error) {
				console.log('catch error:', error);
				return bot.sendMessage(msg.chat.id, 'Возникла проблема, попробуй позже ¯\_(ツ)_/¯')
			}
		break;
	
		default:
		break;
	}
})

bot.on('new_chat_members', msg => {
	const name = msg.new_chat_members[0].first_name || msg.new_chat_members[0].username
	bot.sendMessage(msg.chat.id, `*${name}* теперь вместе с нами, поприветствуем! 👋\n📎 Правила и другую инфу, можно найти в закрепе группы! ⬆️`, { parse_mode: 'markdown' })
})

bot.on('left_chat_member', msg => {
	const name = msg.left_chat_member.first_name || msg.left_chat_member.username
	bot.sendMessage(msg.chat.id, `*${name}* принял(а) волевое решение и покинул(а) нас.`, { parse_mode: 'markdown' })
})

bot.on('polling_error', console.log)