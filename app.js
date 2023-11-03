// require and instantiate express
const app = require('express')()
const mqtt = require('mqtt')

const protocol = 'mqtt'
const host = '207.154.232.103'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `${protocol}://${host}:${port}`
const topic = 'pottur/hiti'

let hiti = 12

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'traktor',
  password: 'mo.Snigill.12',
  reconnectPeriod: 1000,
})

client.on('connect', () => {
  console.log('Connected')

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
    client.publish(topic, '15.5', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })
})

client.on('message', (topic, payload) => {
  hiti = payload.toString()
  console.log('Received Message:', topic, hiti)
})

// fake posts to simulate a database
const posts = []

// set the view engine to ejs
app.set('view engine', 'ejs')

app.get('/hiti', (req, res) => {
  // render `home.ejs` with the list of posts
  res.send(hiti)
})

// blog home page
app.get('/', (req, res) => {
  // render `home.ejs` with the list of posts
  res.render('home', { posts, hiti })
})

// blog post
app.get('/post/:id', (req, res) => {
  // find the post in the `posts` array
  const post = posts.filter((post) => {
    return post.id == req.params.id
  })[0]

  // render the `post.ejs` template with the post content
  res.render('post', {
    author: post.author,
    title: post.title,
    body: post.body
  })
})

app.listen(8080)

console.log('listening on port 8080')
