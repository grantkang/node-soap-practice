var fs = require('fs');
var soap = require('soap');
var express = require('express')

const th = ['', 'thousand', 'million', 'billion', 'trillion'];
const dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

// copyright 25th July 2006, by Stephen Chapman http://javascript.about.com
// modified slightly so that it only works with whole numbers
function inWords(s) {
  s = s.toString();
  s = s.replace(/[, ]/g, '');
  if (s != parseInt(s)) return 'not a number';
  let x = s.length;
  if (x > 15) return 'too big';
  const n = s.split('');
  let str = '';
  let sk = 0;
  for (let i = 0; i < x; i++) {
    if ((x - i) % 3 == 2) {
      if (n[i] == '1') {
        str += tn[Number(n[i + 1])] + ' ';
        i++;
        sk = 1;
      } else if (n[i] != 0) {
        str += tw[n[i] - 2] + ' '; sk = 1;
      }
    } else if (n[i] != 0) {
      str += dg[n[i]] + ' ';
      if ((x - i) % 3 == 0) str += 'hundred ';
      sk = 1;
    }
    if ((x - i) % 3 == 1) {
      if (sk) str += th[(x - i - 1) / 3] + ' ';
      sk = 0;
    }
  }
  return str.substring(0, str.length - 1);
}

function NumberToWords(args) {
  const unsignedLong = args.ubiNum;
  const result = inWords(unsignedLong);
  return { NumberToWordsResult: result}
}

function NumberToDollars(args) {
  const decimal = args.dNum;
  const dollars = Math.floor(decimal);
  const cents = (decimal % 1).toFixed(2) * 100;
  const result = `${inWords(dollars)}dollars and ${inWords(cents)}cents`
  return {NumberToDollarsResult: result };
}

var serviceObject = {
  NumberConversion: {
    NumberConversionSoap: {
      NumberToWords,
      NumberToDollars
    },
    NumberConversionSoap12: {
      NumberToWords,
      NumberToDollars
    }
  }
}


var xml = fs.readFileSync('./server/NumberConversion/NumberConversion.wsdl', 'utf8');

var app = express();

var port = 46318;
app.listen(port, function () {
  console.log('Listening on port ' + port);
  var wsdl_path = "/wsdl";
  soap.listen(app, wsdl_path, serviceObject, xml);
});
