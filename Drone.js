
const dgram = require('dgram')

//drone information
const { droneInfo } = require('./droneConfig')

//tello sdk commands
const commands = require('./telloSdk')

class Drone {
    constructor(customConfig = {}, SDKCommands = commands){
        this.config = {
            ...droneInfo,
            ...customConfig
        }

        //Drone socket
        this.drone = dgram.createSocket('udp4')
        this.drone.bind(this.config.PORT)
        
        //this.drone.send('command', this.config.PORT, this.config.IP, this._handleError)
        //this.drone.send('battery?', this.config.PORT, this.config.IP, this._handleError)

        //drone listening 0.0.0.0:PORT

       this.drone.on('error', err => {
            console.log(`drone error:\n${err.stack}`);
            this.drone.close();
        })
        
        this.drone.on('message', (msg, rinfo) => {
            console.log(`drone got: ${msg} from ${rinfo.address}:${rinfo.port}`);
          });
          
        this.drone.on('listening', () => {
            const address = this.drone.address();
            console.log(`drone listening ${address.address}:${address.port}`);
        });        
    }

    // PRIVATE METHODS
    _handleError(error) {
        if(error){
            console.log(error)
            this.drone.close()
        }
    }

    // Send command method
    command(cmd) {
        this.drone.send('command', this.config.PORT, this.config.IP, this._handleError)
        this.drone.send(cmd, this.config.PORT, this.config.IP, this._handleError)
    }

}

module.exports = Drone