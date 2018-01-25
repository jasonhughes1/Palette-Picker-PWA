
$(document).ready(() => {
  updateRandomColors();
  projectFetcher();
  paletteFetcher()
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

const projectFetcher = async () =>  {
  const project = await fetch('/api/v1/projects')
  const fetchedProject = await project.json()
  const allProjects = fetchedProject.projects
  allProjects.forEach(name => {
    $('.new-project').append(`<option>${name.projectName}</option`)
  })
}

const paletteFetcher = async () => {
  const palettes = await fetch('/api/v1/projects/palettes')
  const fetchedPalettes = await palettes.json()
  const allPalettes = fetchedPalettes.palette
  organizeData(allPalettes)
}

const organizeData = (allPalettes) => {
  const cleanPalettes = allPalettes.reduce((accu, currIndex) => {
      if(!accu[currIndex.projectName]) {
        Object.assign(accu, {[currIndex.projectName]: []})
        accu[currIndex.projectName].push(currIndex)
      } else {
        accu[currIndex.projectName].push(currIndex)
      }
      return accu;
    }, {})
    projectMapper(cleanPalettes)
  }


const projectMapper = (cleanPalettes) => {
  Object.keys(cleanPalettes).map(key => {
    cleanPalettes[key].map(palette => {
      displayPalettes(palette)
    })
  })
}

const displayPalettes =  (palettes) => {

  const { projectName, paletteName, color1, color2, color3, color4, color5, id, projects_id } = palettes
  $('.projects-palettes-container').append(
    `<div projectCard
    <div projectID=${projects_id} paletteID=${id}>
      <h2>${projectName}</h2>
      <h3>${paletteName}</h3>
      <div>${color1}</div>
      <div>${color2}</div>
      <div>${color3}</div>
      <div>${color4}</div>
      <div>${color5}</div>
    </div>
  </div>`
  )
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
