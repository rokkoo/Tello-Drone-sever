//Load server
const app = require('express')()
const http = require('http').Server(app)
const socket = require('socket.io')(http)

const commands = ['command', 'battery?', 'takeoff', 'land'];
const { droneInfo } = require('./droneConfig')
//Drone
const Drone = require('./Drone')
const drone = new Drone()
drone.command('time?')
//Get server port
const PORT = process.env.PORT || 3020

app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
})

app.get('/command', (req, res) => {
    drone.send('comando', 4, droneInfo.PORT, droneInfo.IP, (err) => console.log(err))
    res.send('<h1>Comando</h1>')
})

//sockect connecion
socket.on('connect', (socket) => `user conected`)

http.listen(PORT, () => console.log(`Server running at port http://localhost:${PORT}`))