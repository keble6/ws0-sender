function readTime () {
    date = "" + DS3231.date() + "/" + DS3231.month() + "/" + DS3231.year()
    time = "" + DS3231.hour() + ":" + DS3231.minute() + ":" + DS3231.second()
    dateTime = "" + date + " " + time
}
function makeReading () {
    BME280.PowerOn()
    basic.pause(1000)
    PTH = "" + BME280.pressure(BME280_P.hPa) + "," + BME280.temperature(BME280_T.T_C) + "," + BME280.humidity()
    BME280.PowerOff()
}
input.onButtonPressed(Button.A, function () {
    BME280.PowerOn()
    basic.pause(1000)
    basic.showString("P" + BME280.pressure(BME280_P.hPa))
    basic.showString("T" + BME280.temperature(BME280_T.T_C))
    basic.showString("H" + BME280.humidity())
    BME280.PowerOff()
    basic.pause(1000)
    basic.showNumber(count)
    basic.pause(1000)
    basic.clearScreen()
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
    basic.showNumber(DS3231.date())
    basic.showNumber(DS3231.month())
    basic.showNumber(DS3231.year())
}
function setTime () {
    // the first 2 characters after command
    minute = stringIn.substr(2, 2)
    // the next 2 characters command
    hour = stringIn.substr(4, 2)
    DS3231.dateTime(
    DS3231.year(),
    DS3231.month(),
    DS3231.date(),
    DS3231.day(),
    parseFloat(hour),
    parseFloat(minute),
    0
    )
    basic.showNumber(DS3231.hour())
    basic.showNumber(DS3231.minute())
}
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
let hour = ""
let minute = ""
let year = ""
let month = ""
let stringIn = ""
let PTH = ""
let dateTime = ""
let time = ""
let date = ""
let count = 0
let oneMinute = 60 * 1000
let weatherReadings: number[] = []
count = 0
radio.setGroup(1)
radio.setTransmitPower(7)
