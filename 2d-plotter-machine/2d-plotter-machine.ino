int bufIndex = 0;
char buf[64];

// Incoming command types
const char CMD_MOVE_XY = 'M';
const char CMD_MOVE_Z = 'Z';

// Response message types
const char RSP_OK = '0';
const char RSP_ERROR = 'E';

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
    String response = "M0Got a move XY message\n";
    // String response = CMD_MOVE_XY + RSP_OK + " Got a move XY message\n";
    write(response);
}

void processMoveZMessage(char message[]) 
{   
    String response = "Z0Got a move Z message\n";
    // String response = CMD_MOVE_Z + RSP_OK + " Got a move Z message\n";
    write(response);
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
            String response = RSP_ERROR + " Invalid command type " + type;
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
