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

async function modifyLoan(index) {
  const res1 = await fetch("/results")
  const loans = await res1.json()
  const loan = loans[index]

  const newItem = prompt("Enter new item name:", loan.item) || loan.item;
  const newAuthor = prompt("Enter new author:", loan.author || "") || loan.author;
  const newSection = prompt("Enter new library section:", loan.section) || loan.section;
  const newBorrowed = prompt("Enter new borrowed date (yyyy-mm-dd):", loan.borrowed) || loan.borrowed;
  const newDue = prompt("Enter new due date (yyyy-mm-dd):", loan.due) || loan.due;

  if (!newItem || !newSection || !newBorrowed || !newDue) {
    alert("Modification cancelled or missing required fields.")
    return
  }

  const updatedLoan = {
    item: newItem,
    author: newAuthor,
    section: newSection,
    borrowed: newBorrowed,
    due: newDue
  }

  const res2 = await fetch(`/modify/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedLoan)
  })

  await res2.json()

  const refreshed = await fetch("/results")
  const updatedData = await refreshed.json()
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
        <td>
            <button onclick="deleteLoan(${idx})">Delete</button>
            <button onclick="modifyLoan(${idx})">Modify</button>
        </td>
      </tr>`
  })
}

window.onload = function() {
  document.querySelector("#loan-form").onsubmit = submit
  fetchLoans()
}