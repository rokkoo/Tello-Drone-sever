//Load server
const app = require('express')()
const http = require('http').Server(app)
const socket = require('socket.io')(http)
const bodyParser = require('body-parser');
const cors = require('cors')

const commands = ['command', 'battery?', 'takeoff', 'land'];
const { droneInfo } = require('./droneConfig')

//Get server port
const PORT = process.env.PORT || 3020

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); //https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express

//Drone
const Drone = require('./Drone')
const drone = new Drone()
drone.command('time?')
drone.command('battery?')

app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
})

app.get('/command', (req, res) => {
    drone.send('comando', 4, droneInfo.PORT, droneInfo.IP, (err) => console.log(err))
    res.send('<h1>Comando</h1>')
})

app.post('/', (req, res) => {
    const { cmd } = req.body
    console.log('comando recibido ', cmd)
    drone.command(cmd)
    res.json({
        status: 320
    })
})

//sockect connecion
socket.on('connection', function(socket){
    console.log('Conectado al socket');
    socket.on('command', command => {
        try {
            console.log(`recived command ${command}`)
            drone.command(command)
        }catch {
            console.log('El dron no esta conectado')
        }
    })
    socket.on('disconnect', () => {
        console.log('Desconectado del socket');
      });
  });

http.listen(PORT, () => console.log(`Server running at port http://localhost:${PORT}`))