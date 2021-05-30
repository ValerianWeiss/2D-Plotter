int bufIndex = 0;
char buf[64];

// Incoming command types
const char CMD_MOVE_XY = 'M';
const char CMD_MOVE_Z = 'Z';

// Response message types
const char RSP_OK = '0';
const char RSP_ERROR = 'E';

// Response messages
const String MESSAGE_SEP = "\n";
const String MOVE_XY_OK = String(CMD_MOVE_XY) + String(RSP_OK) + MESSAGE_SEP;
const String MOVE_Z_OK = String(CMD_MOVE_Z) + String(RSP_OK) + MESSAGE_SEP;
const String MOVE_XY_NOT_OK = String(CMD_MOVE_XY) + String(RSP_ERROR) + MESSAGE_SEP;
const String MOVE_Z_NOT_OK = String(CMD_MOVE_Z) + String(RSP_ERROR) + MESSAGE_SEP;

void read()
{
    while (Serial.available() > 0)
    {
        char c = Serial.read();
        buf[bufIndex] = c;
        bufIndex++;

        if (c == '\n')
        {
            processMessage(buf);
            memset(buf, '\0', sizeof(buf));
            bufIndex = 0;
        }
    }
}

void write(String message)
{
    char data[64];
    message.toCharArray(data, sizeof(data));
    Serial.write(data);
}

void processMoveXYMessage(char message[])
{
    write(MOVE_XY_OK);
}

void processMoveZMessage(char message[])
{
    write(MOVE_Z_OK);
}

void processMessage(char message[])
{
    char type = message[0];

    switch (type)
    {
        case CMD_MOVE_XY:
            processMoveXYMessage(message);
            break;
        case CMD_MOVE_Z:
            processMoveZMessage(message);
            break;
        default:
            String response = String(RSP_ERROR) + " Invalid command type " + type;
            break;
    }
}

void setup()
{
    Serial.begin(9600);
}

void loop()
{
    read();
    delay(200);
}
