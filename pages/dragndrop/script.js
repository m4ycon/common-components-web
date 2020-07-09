const tables = document.querySelectorAll('.table');
const items = document.querySelectorAll('.item-drag');

let draggedItem = null;
for (item of items) {
  item.addEventListener('dragstart', event => {
    draggedItem = event.target;
    setTimeout(() => event.target.classList.add('invisible'), 0);
  });
  item.addEventListener('dragend', event => {
    draggedItem = null;
    event.target.classList.remove('invisible');
  });

  for (table of tables) {
    table.addEventListener('dragover', event => {
      if (event.target.classList.contains('table')) {
        event.preventDefault();
        event.target.classList.add('hovered');
      }
    });
    table.addEventListener('dragenter', event => {
      event.preventDefault();
    });
    table.addEventListener('dragleave', event => {
      if (event.target.classList.contains('table'))
        event.target.classList.remove('hovered');
    });
    table.addEventListener('drop', event => {
      if (event.target.classList.contains('table'))
        event.target.append(draggedItem);
        event.target.classList.remove('hovered');
    });
  }
}
