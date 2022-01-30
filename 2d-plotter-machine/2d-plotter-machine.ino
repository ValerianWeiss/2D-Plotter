#include <AccelStepper.h>
#include <MultiStepper.h>
#include <Servo.h>


// Incoming command types
const char CMD_MOVE_XY = 'M';
const char CMD_MOVE_Z = 'Z';
const char CMD_ORIGIN = 'O';
const char CMD_READ_FILE = 'F';
const char CMD_STOP = 'S';
const char CMD_GET_CURR_POS = 'P';

// Response message types
const char RSP_OK = '0';
const char RSP_ERROR = 'E';

// Response messages
const String MESSAGE_SEP = "\n";
const String MOVE_XY_OK = String(CMD_MOVE_XY) + String(RSP_OK);
const String MOVE_Z_OK = String(CMD_MOVE_Z) + String(RSP_OK);
const String ORIGIN_OK = String(CMD_ORIGIN) + String(RSP_OK);
const String READ_FILE_OK = String(CMD_READ_FILE) + String(RSP_OK);
const String STOP_OK = String(CMD_STOP) + String(RSP_OK);
const String CMD_GET_CURR_POS_OK = String(CMD_GET_CURR_POS) + String(RSP_OK);

// Steppers & Servos
AccelStepper xstepper = AccelStepper(AccelStepper::DRIVER, 4, 3, 31, 32, true);
AccelStepper ystepper = AccelStepper(AccelStepper::DRIVER, 7, 6, 41, 42, true);
MultiStepper multiStepper = MultiStepper();
Servo zservo;

// Consts
const int MESSAGE_BUFFER_SIZE = 32;
const int MESSAGE_QUEUE_SIZE = 10;
const int CURRENT_POS_UPDATE_INTERVAL = 1000;

// Variables
int bufferIndex = 0;
char buffer[MESSAGE_BUFFER_SIZE];
int messageQueueIndex = 0;
int messageProcessingIndex = 0;
String messageQueue[MESSAGE_QUEUE_SIZE];
long targetPos[] = {xstepper.currentPosition(), ystepper.currentPosition(), 0};
long lastCurrentPosUpdate = 0;

// State flags
boolean isXYMoving = false;

void setup()
{
    Serial.begin(9600);
    zservo.attach(10);
    multiStepper.addStepper(xstepper);
    multiStepper.addStepper(ystepper);
    xstepper.setMaxSpeed(1000);
    xstepper.setSpeed(1000);
    ystepper.setMaxSpeed(1000);
    ystepper.setSpeed(1000);
}

void read()
{
    int availableBytes = Serial.available();

    if (availableBytes > 0)
    {
        for (int i = 0; i < availableBytes; i++)
        {
            char c = Serial.read();
            buffer[bufferIndex] = c;
            bufferIndex++;

            if (c == '\n')
            {
                String message = String(buffer);
                addMessageToQueue(message);
                memset(buffer, '\0', sizeof(buffer));
                bufferIndex = 0;
            }
        }
    }
}

void write(String message)
{
    message += MESSAGE_SEP;
    char data[64];
    message.toCharArray(data, sizeof(data));
    Serial.write(data);
}

void processMoveXYMessage(String message)
{
    String xTargetPosHex = "0x" + message.substring(1, 5);
    String yTargetPosHex = "0x" + message.substring(5, 9);
    String stepWidthHex = "0x" + message.substring(9, 13);
    long stepWidth = hextol(stepWidthHex);
    long xTargetPos = hextol(xTargetPosHex) * stepWidth;
    long yTargetPos = hextol(yTargetPosHex) * stepWidth;
    targetPos[0] = xTargetPos;
    targetPos[1] = yTargetPos;
    isXYMoving = true;
}

void processSetOriginMessage()
{
    xstepper.setCurrentPosition(0);
    ystepper.setCurrentPosition(0);
    targetPos[0] = 0;
    targetPos[1] = 0;
    write(ORIGIN_OK);
}

void processMoveZMessage(String message)
{
    char movement = message.charAt(1);
    int sign = 1;

    if (movement == '0') {
        sign = -1;
    }

    targetPos[2] += sign * 10;
    zservo.write(targetPos[2]);
    write(MOVE_Z_OK);
}

long hextol(String str)
{
    char buff[64];
    str.toCharArray(buff, 64);
    return strtol(buff, NULL, 16);
}

void processStopMessage()
{
    isXYMoving = false;
    messageQueueIndex = 0;
    messageProcessingIndex = 0;
    write(STOP_OK);
}

void processGetCurrentPosMessage()
{
    sendCurrentPosMessage();
}

void sendCurrentPosMessage()
{
    int numberLength = 4;
    char padding = '0';
    String xHex = String(xstepper.currentPosition(), HEX);
    String yHex = String(ystepper.currentPosition(), HEX);
    String zHex = String(targetPos[2], HEX);
    xHex = padLeft(xHex, numberLength, padding);
    yHex = padLeft(yHex, numberLength, padding);
    zHex = padLeft(zHex, numberLength, padding);
    String message = CMD_GET_CURR_POS_OK + xHex + yHex + zHex;
    write(message);
}

String padLeft(String str, int length, char padding)
{
    while (str.length() < length)
    {
        str = padding + str;
    }
    return str;
}

void processMessage(String message)
{
    char type = message.charAt(0);

    switch (type)
    {
        case CMD_MOVE_XY:
            processMoveXYMessage(message);
            break;
        case CMD_MOVE_Z:
            processMoveZMessage(message);
            break;
        case CMD_ORIGIN:
            processSetOriginMessage();
            break;
        case CMD_STOP:
            processStopMessage();
            break;
        case CMD_GET_CURR_POS:
            processGetCurrentPosMessage();
        default:
            String response = String(RSP_ERROR) + "_Invalid_command_type_" + type;
            break;
    }
}

void addMessageToQueue(String message)
{
    messageQueue[messageQueueIndex] = message;
    messageQueueIndex = ++messageQueueIndex == MESSAGE_QUEUE_SIZE ? 0 : messageQueueIndex++;
}

void processMessageQueue()
{
    if (messageProcessingIndex != messageQueueIndex && !isXYMoving)
    {
        String message = messageQueue[messageProcessingIndex];
        processMessage(message);
        messageProcessingIndex = messageProcessingIndex++ == MESSAGE_QUEUE_SIZE ? 0 : messageProcessingIndex++;
    }
}

void sendCurrentPos()
{
    long currentMillis = millis();


    if (currentMillis >= lastCurrentPosUpdate + CURRENT_POS_UPDATE_INTERVAL)
    {
        lastCurrentPosUpdate = currentMillis;
        sendCurrentPosMessage();
    }
}

void move()
{
    processMessageQueue();

    if (isXYMoving)
    {
        long xyTargetPos[] = {targetPos[0], targetPos[1]};
        multiStepper.moveTo(xyTargetPos);
        multiStepper.run();
    }

    if (xstepper.distanceToGo() == 0 && ystepper.distanceToGo() == 0 && isXYMoving)
    {
        write(MOVE_XY_OK);
        isXYMoving = false;
    }
}

void loop()
{
    read();
    move();
    sendCurrentPos();
}
