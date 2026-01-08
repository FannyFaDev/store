const form = document.getElementById('form')
const itemsDiv = document.getElementById('items')

form.onsubmit = async e => {
  e.preventDefault()
  const fd = new FormData(form)
  await apiFetch('/admin/items', { method:'POST', body: fd })
  form.reset()
  load()
}

async function load() {
  const res = await apiFetch('/admin/items')
  const data = await res.json()
  itemsDiv.innerHTML = ''

  data.forEach(i => {
    itemsDiv.innerHTML += `
      <div class="item">
        <b>${i.name}</b><br>
        Rp ${i.price}<br>
        ${i.description}<br>
        ${i.media ? mediaView(i.media) : ''}
        <br>
        <button onclick="hapus(${i.id})">HAPUS</button>
        <a href="/edit.html?id=${i.id}" style="margin-left:8px"><button>Edit</button></a>
      </div>
    `
  })
}

function mediaView(file) {
  if (file.endsWith('.mp4'))
    return `<video src="/uploads/${file}" width="200" controls></video>`
  return `<img src="/uploads/${file}" width="200">`
}

async function hapus(id) {
  await apiFetch('/admin/items/' + id, { method:'DELETE' })
  load()
}

load()
