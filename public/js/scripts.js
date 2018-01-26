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
    cleanPalettes[key].map((palette, index) => {
      displayPalettes(palette, index)
    })
  })
}

const displayPalettes =  (palettes, index) => {
  const { projectName, paletteName, color1, color2, color3, color4, color5, id, projects_id } = palettes
  $('.projects-palettes-container').append(
    ` <div id='palette-card' projectID=${projects_id} paletteID=${id}>
      <h2>${projectName}</h2>
      <h3>${paletteName}</h3>
      <div id='${paletteName}-${index}-1'>${color1}</div>
      <div id='${paletteName}-${index}-2'>${color2}</div>
      <div id='${paletteName}-${index}-3'>${color3}</div>
      <div id='${paletteName}-${index}-4'>${color4}</div>
      <div id='${paletteName}-${index}-5'>${color5}</div>
  </div>`
  )
  $(`#${paletteName}-${index}-1`).css('background-color', color1)
  $(`#${paletteName}-${index}-2`).css('background-color', color2)
  $(`#${paletteName}-${index}-3`).css('background-color', color3)
  $(`#${paletteName}-${index}-4`).css('background-color', color4)
  $(`#${paletteName}-${index}-5`).css('background-color', color5)
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

const savePalette = (event) => {
  event.preventDefault()
  const paletteName = $('.palette-input').val()
  const projectName = $('.new-project').val()
  const projects_id = $('#palette-card').attr('projectID')

  const palColors = {
    color1: $('.code1').text(),
    color2: $('.code2').text(),
    color3: $('.code3').text(),
    color4: $('.code4').text(),
    color5: $('.code5').text()
  }
  const pal = { projectName, paletteName, projects_id, ...palColors }
  postPalette(pal)
}

const postPalette = async (palette) => {

  try {
    const postNewPalette = await fetch(`/api/v1/projects/${palette.projects_id}/palette`, {
      method: 'POST',
      body: JSON.stringify({ palette }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const paletteInfo = await postNewPalette.json()
    return paletteInfo
    } catch (error) {
  }
}

$('.save-button-project').on('click', event => projectGenerator());
$('.unlocked-image').on('click', event => toggleLockIcon(event));
$('.generate-button').on('click', updateRandomColors);
$('.save-button-palette').on('click', event => savePalette(event));
