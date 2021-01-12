const WebSocket = require('ws');
const SerialPort = require('serialport');

const port = 3000;
const serialPortName = 'COM4';

const serialPort = new SerialPort(serialPortName, {
  baudRate: 9600,
   dataBits: 8, // defaults for Arduino serial communication
   parity: 'none',
   stopBits: 1,
   flowControl: false
});

serialPort.on('open', () => {
  logSerial(`serial port ${serialPortName} is open`);
  const wss = new WebSocket.Server({ port });

  wss.on('connection', ws => {
    logWs('webclient connected');
    ws.on('message', message => {
      logWs(`received message: ${message}`);
      serialPort.write(`${message}\n`);
      logWs(`send message to serial: ${message}`);
    });

    ws.on('close', (code, reason) => {
      logWs(`a web client disconnected with code: ${code} and reason: ${reason}`);
    });

    ws.on('error', error => {
      logWs('error occurred:');
      logWs(error);
    })
  });
});

serialPort.on('data', data => {
  logSerial(`got data: ${data}`);
});

serialPort.on('error', error => {
  logSerial('error occurred:');
  logSerial(error.message);
});

const log = message => console.log(`${new Date().toISOString()}    ${message}`);
const logWs = message => log(`ws: ${message}`);
const logSerial = message => log(`serial: ${message}`);
