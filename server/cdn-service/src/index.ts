import 'dotenv/config'
if (process.env.NODE_ENV === 'production') {
  require('module-alias/register')
}
import http from 'http'
import express from 'express'
import { VerifyDiscordRequest } from './discord/verify'
import { InteractionType, InteractionResponseType } from 'discord-interactions'
import { register } from './discord/commands'
import { Discord } from './discord'
import cors from 'cors'
import bodyParser from 'body-parser'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import multer from 'multer'
import delay from 'delay'
var tokenStorage: Map<
  string,
  {
    data: any
    emit_to: string
    event_name: string
  }
> = new Map()
interface SenderData {
  url: string
  header: unknown
  payload: {
    id: string
    [key: string]: any
  }
  from: string
  error?: string | null
  type: 'rep' | 'message'
}
let connectUrl = `ws://${process.env.WS_HOST}:${process.env.WS_PORT}/`
let ClientSocket = new W3CWebSocket(connectUrl)
let SocketIsClose = false
;(async () => {
  ClientSocket.onerror = function () {
    console.log('Connection Error')
    SocketIsClose = true
  }

  ClientSocket.onopen = function () {
    console.log('WebSocket Client Connected')
  }

  ClientSocket.onclose = function () {
    console.log('echo-protocol Client Closed')
    SocketIsClose = true
  }

  ClientSocket.onmessage = function (e) {
    let data = e.data
    if (typeof data != 'string') {
      return
    }
    let jsonData: SenderData = JSON.parse(data)
    console.log(jsonData)
    if (jsonData.type != 'message') return
    if (jsonData.url == 'upload_token_registry/genToken') {
      let { id, data, emit_to, event_name } = jsonData.payload
      tokenStorage.set(id, { data, emit_to, event_name })
      // genToken
      let responseData: SenderData = {
        url: jsonData.from,
        type: 'rep',
        from: jsonData.url,
        header: null,
        error: null,
        payload: {
          id: id,
          token: id,
        },
      }
      ClientSocket.send(JSON.stringify(responseData))
    }
  }
})()
async function UploadImageSuccess(
  url: string[],
  id: string,
): Promise<
  [
    boolean,
    {
      err: string
    } | null,
  ]
> {
  if (SocketIsClose) {
    return [
      false,
      {
        err: 'socket is close',
      },
    ]
  }
  let doc = tokenStorage.get(id)
  if (!doc) {
    return [
      false,
      {
        err: 'token not found',
      },
    ]
  }
  let socketUrl = `${doc.emit_to}/${doc.event_name}`

  let request: SenderData = {
    type: 'message',
    header: null,
    from: 'upload_token_registry/user_upload_webhook',
    url: socketUrl,
    error: null,
    payload: {
      id: crypto.randomUUID(),
      url,
    },
  }
  ClientSocket.send(JSON.stringify(request))
  return [true, null]
}

const app = express()
const PORT = process.env.PORT || 3000 || 1688
const server = http.createServer(app)

app.use(bodyParser.urlencoded({ extended: true, limit: '7mb' }))
app.use(bodyParser.json({ limit: '7mb' }))

app.use(bodyParser.raw())
app.use(cors())

app.use(
  express.json({
    verify: VerifyDiscordRequest(process.env.CLIENT_KEY || ''),
  }),
)

app.post('/interactions', (req, res) => {
  const { type, data } = req.body
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG })
  }
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data
    if (name === 'ping') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Pong!',
        },
      })
    }
  }
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.post('/', async (req, res) => {
  res.send('Hello World!')
})

app.post('/save', multer().any(), async function (req, res) {
  const bot = new Discord(process.env.TOKEN || '')
  const { message } = req.body

  if (!message) return res.send('No message')
  // eslint-disable-next-line no-var
  var data = ''
  const base64Image = message.split(';base64,').pop() as string
  const image = Buffer.from(base64Image, 'base64')

  let ResponseData = await bot.rest(
    `/channels/${process.env.CHANNEL_ID}/messages`,
    {
      files: image,
    },
    'POST',
  )
  console.log(ResponseData)

  // bot.on('data', (imageData) => {
  //   const newImageData = JSON.parse(imageData)
  //   data = JSON.stringify(newImageData.attachments[0])
  //   console.log({ 'newImageData.attachments': newImageData.attachments })
  //   // UploadImageSuccess([data])
  //   res.send(data)
  // })
})

server.on('listening', () => {
  console.log('Server is listening on port ', PORT)
  register(process.env.APPLICATION_ID || '', {
    name: 'ping',
    description: 'Ping!',
    type: 1,
  })
})
server.listen(PORT)

// process.on('exit', () => {
//   process.exit(0)
// })
