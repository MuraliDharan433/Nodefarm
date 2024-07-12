const fs = require("fs");
const http = require("http");
const url = require("url");
const replacetemplate = require("./modules/replacetem")

//// Data geting
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);



const server = http.createServer((req, res) => {

const {query,pathname} = url.parse(req.url,true);


  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    const cardhtml = dataObject
      .map((el) => replacetemplate(tempCard, el))
      .join();
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardhtml);
    res.writeHead(200, {
      "Content-type": "text/html",
      "my-own-header": "header",
    });
    res.end(output);
  }

  //Product page
  else if (pathname === "/product") {
    res.writeHead(200,{
        'Content-type': 'text/html',
        'my-own-header':'header'
    })
    const product = dataObject[query.id];
    const output = replacetemplate(tempProduct, product)
    res.end(output);
    // res.end("product page")
  }

  //API page
  else if (pathname === "/api") {
    res.end("API");
  }

  //Error page
  else {
    res.writeHead(404,{
        'Content-type': 'text/html',
        'my-own-header':'header'
    })
    res.end(`<h1>Page Not Found</h1>`);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
});
