$(document).ready(() => {
  updateRandomColors();
});

const generateRandomColor = () => {
  console.log('in generate random color function');
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  };
  console.log(color);
  return color;
};


const updateRandomColors = (i) => {
  for (var i = 0; i < 6; i++) {

  if(!$(`.color${i}`).hasClass('locked')) {
    let color = generateRandomColor()
    $(`.color${i}`).css('background-color', color);
    $(`.hex-code${i}`).text(color)
  };
 };
};

const toggleLockIcon = () => {

}


$('.generate-button').on('click', updateRandomColors)
