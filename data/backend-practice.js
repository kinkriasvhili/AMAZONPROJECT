//http message create
let xhr = new XMLHttpRequest();

xhr.addEventListener("load", () => {
  //get response
  console.log(xhr.response);
});

/**Parametres = P */
//P - type of request - GET, POST, PUT, DELETE - all in '';
//p - where to send this HTTP message - URL;
//http message set request
xhr.open("GET", "https://supersimplebackend.dev");
//http message sent request
xhr.send();
//http messages in network

//get response it take times and is not available for a tyme
//asycronous code
//for example in one second it come back and we can use set time out but it isn't useful

// setTimeout(() => {
//   console.log(xhr.response);
// },100);
// use listener 'load'

//Statuse Code(ერორი) - start with 4 our fault start 5 backend fault start 2 success

//The list of all url path that are supported called backedn API - apicatoin programming interface(how we interact with something)

//backedn can response with different type of data JSON,IMG,TEXT,HTML etc

//example: every time we write link on browser it is same as about we sent requst and get response. if we write https://supersimplebackend.dev/images/apple.jpg we get apple image same as if we use it with xhr.opne("GET", "URL")
