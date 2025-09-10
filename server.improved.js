const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

function calcDaysRemaining(borrowed, due) {
  const today = new Date();
  const dueDate = new Date(due);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((dueDate - today) / msPerDay);
}

const appdata = [
  {
    item: "Atomic Habits",
    author: "James Clear",
    section: "Psychology",
    borrowed: "2025-09-01",
    due: "2025-09-15",
    daysRemaining: calcDaysRemaining("2025-09-01","2025-09-15"),
  },
  {
    item: "Twister",
    section: "Board Games",
    borrowed: "2025-08-20",
    due: "2025-09-20",
    daysRemaining: calcDaysRemaining("2025-08-20","2025-09-20"),
  },
]

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  }else if ( request.method === "PUT" ){
    handlePut( request, response )
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  } else if ( request.url === "/results" ) {
    const today = new Date()
    const msPerDay = 1000 * 60 * 60 * 24
    const updatedLoans = appdata.map(l => {
      const dueDate = new Date(l.due)
      return { ...l, daysRemaining: Math.ceil((dueDate - today) / msPerDay) }
    })

    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(updatedLoans))
  } else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    const incoming = JSON.parse(dataString);
    console.log(incoming);

    if (request.url === "/delete") {
      const idx = incoming.index
      if (idx >= 0 && idx < appdata.length) {
        appdata.splice(idx, 1)
      }

      response.writeHead(200, { "Content-Type": "application/json" })
      response.end(JSON.stringify(appdata))
      return
    }

    const today = new Date();
    const dueDate = new Date(incoming.due)
    const msPerDay = 24 * 60 * 60 * 1000
    const daysRemaining = Math.round((dueDate - today) / msPerDay)

    incoming.daysRemaining = daysRemaining

    appdata.push(incoming)

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  })
}

const handlePut = function( request, response ) {
  let dataString = ""

  request.on("data", function (data) {
    dataString += data
  })

  request.on("end", function () {
    const incoming = JSON.parse(dataString)
    const urlParts = request.url.split("/")
    const idx = parseInt(urlParts[2], 10)

    if (isNaN(idx) || idx < 0 || idx >= appdata.length) {
      response.writeHead(400, { "Content-Type": "application/json" })
      response.end(JSON.stringify({ error: "Invalid index" }))
      return
    }

    const today = new Date()
    const dueDate = new Date(incoming.due)
    const msPerDay = 24 * 60 * 60 * 1000
    incoming.daysRemaining = Math.round((dueDate - today) / msPerDay)

    appdata[idx] = { ...appdata[idx], ...incoming }

    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {
       // status code: https://httpstatuses.com
       response.writeHead( 200, { "Content-Type": type } )
       response.end(content)
     }else{
       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )
     }
   })
}

server.listen( process.env.PORT || port )