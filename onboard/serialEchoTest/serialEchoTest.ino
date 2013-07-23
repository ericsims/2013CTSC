void setup() {
  // initialize serial:
  Serial.begin(9600);
}

void loop() {
  // if there's any serial available, read it:
  while (Serial.available() > 0) {

    // look for the next valid integer in the incoming serial stream:
    int red = Serial.parseInt(); 

    // look for the newline. That's the end of your
    // sentence:
    if (Serial.read() == '\n') {
      Serial.print(red, HEX);
    }
  }
}








