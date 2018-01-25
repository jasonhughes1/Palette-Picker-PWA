$(document).ready(() => {
  updateRandomColors();
  projectFetcher();
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

const projectGenerator = () => {
  let project = $('.project-input').val();
  $('.new-project').append(`<option>${project}</option>`)
  postProject(project)
}
// const paletteGenerator = () => {
// }

const projectFetcher = async () =>  {
  const project = await fetch('/api/v1/projects')
  const fetchedProject = await project.json()
  const allProjects = fetchedProject.projects
  allProjects.forEach(name => {
    $('.new-project').append(`<option>${name.projectName}</option`)
  })
}

const postProject = async (name) => {
  try {
    const postNewProject = await fetch('api/v1/projects', {
      method: 'POST',
      body: JSON.stringify({projectName: name}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const projectInfo = await postNewProject.json()
    return projectInfo
  }  catch (error) {
  }
}


$('.save-button-project').on('click', event => projectGenerator());
$('.unlocked-image').on('click', event => toggleLockIcon(event));
$('.generate-button').on('click', updateRandomColors)
