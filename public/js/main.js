// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const form = document.querySelector( "#loan-form" ),
        formData = new FormData(form),
        json = {
          item: formData.get("item"),
          author: formData.get("author"),
          section: formData.get("section"),
          borrowed: formData.get("borrowed"),
          due: formData.get("due"),
        },
        body = JSON.stringify( json )

  const response = await fetch( "/", {
    method:"POST",
    body 
  })

  const updated = await response.json()
  renderTable(updated)
  form.reset()
}

async function deleteLoan(index) {
  const body = JSON.stringify({ index })

  const response = await fetch("/delete", {
    method: "POST",
    body
  })

  const updatedData = await response.json()
  renderTable(updatedData)
}

async function fetchLoans() {
  const response = await fetch("/results");
  const data = await response.json();
  renderTable(data);
}

function renderTable(loans) {
  const table = document.querySelector("#results");
  table.innerHTML = `
    <tr>
      <th>Title</th><th>Author</th><th>Section</th>
      <th>Borrowed</th><th>Due</th><th>Days Remaining</th>
      <th>Actions</th>
    </tr>
  `
  loans.forEach((loan, idx) => {
    table.innerHTML += `
      <tr>
        <td>${loan.item}</td>
        <td>${loan.author || "-"}</td>
        <td>${loan.section}</td>
        <td>${loan.borrowed}</td>
        <td>${loan.due}</td>
        <td>${loan.daysRemaining}</td>
        <td><button onclick="deleteLoan(${idx})">Delete</button></td>
      </tr>`
  })
}

window.onload = function() {
  document.querySelector("#loan-form").onsubmit = submit
  fetchLoans()
}