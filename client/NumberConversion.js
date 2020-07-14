var soap = require('soap')

var url = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL';


(async function main() {
  const client = await soap.createClientAsync(url);
  client.NumberToWords({ubiNum: 1337}, (err, result) => {
    console.log(result.NumberToWordsResult);
  })
  client.NumberToDollars({dNum: 13.37}, (err, result) => {
    console.log(result.NumberToDollarsResult);
  })
})();
