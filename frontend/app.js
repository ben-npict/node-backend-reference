// Use Environment variable or default to localhost
const API_BASE = process.env.API_BASE || 'http://localhost:3000';


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

async function fetchRestaurants(){
  const res = await fetch(`${API_BASE}/restaurants`);
  if(!res.ok) throw new Error('Failed to load restaurants');
  return await res.json();
}
async function initTableFromApi(){
  const data = await fetchRestaurants();
  const rows = data.map(r => [r.name, r.cuisine, r.rating, actionButtons(r.id)]);
  if(table) table.destroy();
  table = new DataTable('#restaurantsTable', { data: rows });
}

document.addEventListener('DOMContentLoaded', initTableFromApi);
// document.addEventListener('DOMContentLoaded', initTableWithStatic);