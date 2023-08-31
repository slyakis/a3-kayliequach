// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( e ) {
  const input = document.querySelector( '#yourname' ),
        json = { yourname: input.value },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()

  console.log( 'text:', text )
}

window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
}