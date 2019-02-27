const dgram = require("dgram");

//drone information
const { droneInfo } = require("./droneConfig");

//tello sdk commands
const commands = require("./telloSdk");

class Drone {
  constructor({customConfig = {}, SDKCommands = commands, socket}) {
    this.config = {
      ...droneInfo,
      ...customConfig
    };

    this.socket = socket;

    // Drone socket
    this.drone = dgram.createSocket("udp4");
    this.drone.bind(this.config.PORT);

    // Drone state socket
    this.droneState = dgram.createSocket("udp4");
    this.droneState.bind(this.config.LISTEN_STATE_PORT);

    this.droneStream = dgram.createSocket("udp4");
    this.droneStream.bind(this.config.LISTEN_VIDEO_PORT);

    // Drone stream socket
    this.drone.send(
      "command",
      this.config.PORT,
      this.config.IP,
      this._handleError
    );
    this.drone.send(
      "streamon",
      this.config.PORT,
      this.config.IP,
      this._handleError
    );
    //drone listening 0.0.0.0:PORT

    this.drone.on("message", (msg, rinfo) => {
      console.log(`drone got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    // Drone state callback
    this.droneState.on("message", (msg, rinfo) => {
      console.log(
        // `drone state got: ${msg} from ${rinfo.address}:${rinfo.port}`
      );
    });

    this.droneStream.on("message", (msg, rinfo) => {
        console.log('enviado stream')
        this.socket.emit('stream', msg)
      //console.log(`drone stream got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });
  }

  // PRIVATE METHODS
  _handleError(error) {
    if (error) {
      console.log(error);
      this.drone.close();
    }
  }

  // Send command method
  command(cmd) {
    this.drone.send(
      "command",
      this.config.PORT,
      this.config.IP,
      this._handleError
    );
    this.drone.send(cmd, this.config.PORT, this.config.IP, this._handleError);
  }
}

module.exports = Drone;
