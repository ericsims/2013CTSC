void setup() {
  // initialize serial:
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}
void loop() {
  while (Serial.available() > 0) {
    int value = Serial.parseInt();
     Serial.write(value+'\n'); 
    if (Serial.read() == '\n') {
      digitalWrite(13, value);
    }
  }
}








