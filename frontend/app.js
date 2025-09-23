const API_BASE = 'https://miniature-guacamole-594jvrg6494h7x76-3000.app.github.dev'; // change if different
let table;
let editingId = null;

function actionButtons(id){
  return `<button class="btn btn-sm btn-outline-secondary me-1 edit" data-id="${id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete" data-id="${id}">Delete</button>`;
}

async function fetchRestaurants(){
  const res = await fetch(`${API_BASE}/restaurants`);
  if(!res.ok) throw new Error('Failed to load restaurants');
  return await res.json();
}

async function addRestaurant(data) {
  const res = await fetch(`${API_BASE}/restaurants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to add restaurant');
  return await res.json();
}

async function updateRestaurant(id, data) {
  const res = await fetch(`${API_BASE}/restaurants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update restaurant');
  return await res.json();
}

async function deleteRestaurant(id) {
  const res = await fetch(`${API_BASE}/restaurants/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete restaurant');
}

function showAlert(message, type = 'success') {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert alert-${type}`;
  alert.classList.remove('d-none');
  setTimeout(() => alert.classList.add('d-none'), 2000);
}

async function initTableFromApi(){
  const data = await fetchRestaurants();
  const rows = data.map(r => [r.name, r.cuisine, r.rating, actionButtons(r.id)]);
  if(table) table.destroy();
  table = new DataTable('#restaurantsTable', { data: rows });
}

document.addEventListener('DOMContentLoaded', () => {
  initTableFromApi();

  // Handle form submit for add/edit
  document.getElementById('createForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const cuisine = document.getElementById('cuisine').value.trim();
    const rating = parseInt(document.getElementById('rating').value, 10);
    if (!name || !cuisine || isNaN(rating)) {
      showAlert('All fields are required', 'danger');
      return;
    }
    try {
      if (editingId) {
        await updateRestaurant(editingId, { name, cuisine, rating });
        showAlert('Restaurant updated!');
        editingId = null;
        this.querySelector('button[type="submit"]').textContent = 'Add';
      } else {
        await addRestaurant({ name, cuisine, rating });
        showAlert('Restaurant added!');
      }
      this.reset();
      await initTableFromApi();
    } catch (err) {
      showAlert(err.message, 'danger');
    }
  });

  // Delegate edit/delete button clicks
  document.getElementById('restaurantsTable').addEventListener('click', async function(e) {
    if (e.target.classList.contains('edit')) {
      const id = e.target.getAttribute('data-id');
      try {
        const res = await fetch(`${API_BASE}/restaurants/${id}`);
        if (!res.ok) throw new Error('Failed to fetch restaurant');
        const r = await res.json();
        document.getElementById('name').value = r.name;
        document.getElementById('cuisine').value = r.cuisine;
        document.getElementById('rating').value = r.rating;
        editingId = id;
        document.querySelector('#createForm button[type="submit"]').textContent = 'Update';
      } catch (err) {
        showAlert(err.message, 'danger');
      }
    } else if (e.target.classList.contains('delete')) {
      const id = e.target.getAttribute('data-id');
      if (confirm('Delete this restaurant?')) {
        try {
          await deleteRestaurant(id);
          showAlert('Restaurant deleted!');
          await initTableFromApi();
        } catch (err) {
          showAlert(err.message, 'danger');
        }
      }
    }
  });
});