const API_BASE = 'http://localhost:3000'; // change if different
let table;

function actionButtons(id){
  return `<button class="btn btn-sm btn-outline-secondary me-1 edit" data-id="${id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete" data-id="${id}">Delete</button>`;
}

function initTableWithStatic(){
  const staticRows = [
    { id: 1, name: 'Sushi Star', cuisine: 'Japanese', rating: 5 },
    { id: 2, name: 'Bella Pasta', cuisine: 'Italian', rating: 4 }
  ];
  const rows = staticRows.map(r => [r.name, r.cuisine, r.rating, actionButtons(r.id)]);
  table = new DataTable('#restaurantsTable', { data: rows });
}

document.addEventListener('DOMContentLoaded', initTableWithStatic);