const { ipcRenderer } = require('electron');
const items = require('./items')


let closeModal = document.getElementById('close-modal'),
  modal = document.getElementById('modal'),
  addItem = document.getElementById('add-item'),
  itemUrl = document.getElementById('url'),
  showModal = document.getElementById('show-modal');
  search = document.getElementById('search');

search.addEventListener('keyup', e => {
  Array.from(document.getElementsByClassName('read-item')).forEach(item => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? 'flex' : 'none';
  })
})

document.addEventListener('keydown', e => {
  if (e.key ==='ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
})

ipcRenderer.on('menu-show-modal', () => {
  showModal.click();
})

const toggleModalButtons = () => {
  if(!!addItem.disabled) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = 'inline'
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = 'none'
  }
}

showModal.addEventListener('click', e => {
  modal.style.display = 'flex';
  itemUrl.focus();
})

closeModal.addEventListener('click', e => {
  modal.style.display = 'none';
})


addItem.addEventListener('click', e => {
  if (!!itemUrl.value) {
    ipcRenderer.send('new-item', itemUrl.value);
    toggleModalButtons();
  }
})

itemUrl.addEventListener('keyup', e => {
  if (e.key === 'Enter') addItem.click();
})


ipcRenderer.on('new-item-success', (e, newItem) => {
  items.addItem(newItem, true);
  toggleModalButtons();
  modal.style.display = 'none'
  itemUrl.value = '';
})

ipcRenderer.on('menu-open-item', () => {
  items.open();
})

ipcRenderer.on('menu-delete-item', () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
})

ipcRenderer.on('menu-open-item-native', () => {
  items.openNative();
})

ipcRenderer.on('menu-focus-search', () => {
  search.focus();
})
