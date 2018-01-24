$(document).ready(() => {
  updateRandomColors();
});

const generateRandomColor = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  };
  return color;
};


const updateRandomColors = (i) => {
  for (var i = 0; i < 6; i++) {
    if(!$(`.color${i}`).hasClass('selected')) {
      let color = generateRandomColor()
      $(`.color${i}`).css('background-color', color)
      $(`.code${i}`).text(color)
    }
  };
};

const toggleLockIcon = (event) => {
  const icon = $(event.target);
    icon.parents('.color').toggleClass('selected')
    icon.closest('.unlocked-image').toggleClass('locked');
}

$('.unlocked-image').on('click', event => toggleLockIcon(event));
$('.generate-button').on('click', updateRandomColors)
