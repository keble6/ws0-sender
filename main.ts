function readTime () {
    date = "" + DS3231.date() + "/" + DS3231.month() + "/" + DS3231.year()
    time = "" + DS3231.hour() + ":" + DS3231.minute()
    dateTime = "" + date + " " + time
}
function makeReading () {
    BME280.PowerOn()
    basic.pause(1000)
    PTH = "" + BME280.pressure(BME280_P.hPa) + "," + BME280.temperature(BME280_T.T_C) + "," + BME280.humidity()
    BME280.PowerOff()
}
// Test block
input.onButtonPressed(Button.A, function () {
    if (count > 0) {
        basic.showString("" + (dateTimeReadings[0]))
        basic.showString("" + (weatherReadings[0]))
        basic.pause(1000)
        basic.showNumber(count)
        basic.pause(1000)
        basic.clearScreen()
    } else {
        basic.showString("wait for reading")
    }
})
function setDate () {
    // the first 2 characters after command
    date = stringIn.substr(2, 2)
    // the next 2 characters
    month = stringIn.substr(4, 2)
    // the last 4 characters
    year = stringIn.substr(6, 4)
    DS3231.dateTime(
    parseFloat(year),
    parseFloat(month),
    parseFloat(date),
    DS3231.day(),
    DS3231.hour(),
    DS3231.minute(),
    0
    )
    serial.writeNumber(DS3231.date())
    serial.writeNumber(DS3231.month())
    serial.writeNumber(DS3231.year())
    serial.writeLine("")
}
// Reset readings
input.onButtonPressed(Button.AB, function () {
    weatherReadings = []
    dateTimeReadings = []
    count = 0
    // Debug - reset
    serial.writeLine("Resetting readings")
})
function setTime () {
    // the first 2 characters after command
    hour = stringIn.substr(2, 2)
    // the next 2 characters command
    minute = stringIn.substr(4, 2)
    DS3231.dateTime(
    DS3231.year(),
    DS3231.month(),
    DS3231.date(),
    DS3231.day(),
    parseFloat(hour),
    parseFloat(minute),
    0
    )
    serial.writeNumber(DS3231.hour())
    serial.writeNumber(DS3231.minute())
    serial.writeLine("")
}
radio.onReceivedString(function (receivedString) {
    // Debug - radio received
    serial.writeLine("radio received")
    if (count > 0) {
        basic.pause(2000)
        for (let index = 0; index <= count - 1; index++) {
            radio.sendString("" + (dateTimeReadings[index]))
            radio.sendString("" + (weatherReadings[index]))
            basic.pause(500)
        }
    }
})
// Instant PTH
input.onButtonPressed(Button.B, function () {
    makeReading()
    basic.showString(PTH)
})
serial.onDataReceived(serial.delimiters(Delimiters.CarriageReturn), function () {
    stringIn = serial.readUntil(serial.delimiters(Delimiters.CarriageReturn))
    command = stringIn.substr(0, 2)
    if (command == "st") {
        setTime()
    }
    if (command == "sd") {
        setDate()
    }
})
let command = ""
let minute = ""
let hour = ""
let year = ""
let month = ""
let stringIn = ""
let PTH = ""
let dateTime = ""
let time = ""
let date = ""
let count = 0
let dateTimeReadings: string[] = []
let weatherReadings: string[] = []
let oneMinute = 60000
weatherReadings = []
dateTimeReadings = []
count = 0
radio.setGroup(1)
radio.setTransmitPower(7)
// Debug - start serial
serial.writeLine("abc")
loops.everyInterval(oneMinute, function () {
    // Take readings once per hour
    if (DS3231.minute() == 0) {
        // Debug - make a reading
        serial.writeLine("Making a reading")
        readTime()
        dateTimeReadings.push(dateTime)
        makeReading()
        weatherReadings.push(PTH)
        count += 1
    }
    basic.showLeds(`
        . . . . #
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    basic.pause(50)
    basic.clearScreen()
})
