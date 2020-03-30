const SI7021 = require("si7021-sensor");
const fs = require("fs");
const dayjs = require("dayjs");
//const rpio = require('rpio');
//const matrix = require('8x8matrix');
const numbers = require("./led_numbers");

//matrix.init(rpio);
const sensor = new SI7021({ i2cBusNo: 1 });

const readSensorData = () => {
  sensor
    .readSensorData()
    .then(data => {
      let temp = parseInt(data.temperature_C);
      let humidity = parseInt(data.humidity);
      let tempF = parseInt(temp * (9 / 5) + 32);

      let time = dayjs();
      let formattedDate = time.format("YYYY-MM-DD");
      let formattedTime = time.format("YYYY-MM-DD---HH:mm:ss.SSS");
      //console.log(`data = ${JSON.stringify(data, null, 2)}`);
      console.log(formattedTime, "Temperature:", temp, "Humidity:", humidity);
      const dataString = `${formattedTime}\t\tTemp: ${temp} C ${tempF} F\tHumidity: ${humidity}%\n`;

      let stream = fs.createWriteStream(
        `${__dirname}/data/${formattedDate}.txt`,
        {
          flags: "a",
          mode: 0o777
        }
      );
      stream.write(dataString);
      stream.end();

      //matrix.writeArray(numbers.textRepresentationOfInteger(temp))
    })
    .catch(err => {
      console.log(`Si7021 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
};

sensor
  .reset()
  .then(result => readSensorData())
  .catch(err => console.error(`Si7021 reset failed: ${err} `));

setInterval(readSensorData, 1000 * 60);

let numberMap = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
  21: "twentyOne",
  22: "twentyTwo",
  23: "twentyThree",
  24: "twentyFour",
  25: "twentyFive",
  26: "twentySix",
  27: "twentySeven",
  28: "twentyEight",
  29: "twentyNine",
  30: "thirty",
  31: "thirtyOne",
  32: "thirtyTwo"
};

function textRepresentationOfInteger(integer) {
  return numberMap[integer];
}
