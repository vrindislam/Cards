export function DragDrop(elements) {
  const allCards = document.querySelectorAll(elements);
  allCards.forEach(card => {
    card.onmousedown = function (event) {
      if ((event.target.classList.contains('details-btn') || event.target.classList.contains('edit-btn') || event.target.classList.contains('delete-btn'))) {
        return;
      }
      let shiftX = event.clientX - card.getBoundingClientRect().left;
      let shiftY = event.clientY - card.getBoundingClientRect().top;
      card.style.position = "absolute";
      card.style.zIndex = 1000;
      card.style.cursor = "grab";
      document.body.append(card);
      movePosElem(event.pageX, event.pageY);

      function movePosElem(pageX, pageY) {
        card.style.left = pageX - shiftX + 'px';
        card.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        movePosElem(event.pageX, event.pageY);
      }

      card.ondragstart = function () {
        return false;
      };
      document.addEventListener('mousemove', onMouseMove);
      card.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        card.onmouseup = null;
      };
    };
  })
}