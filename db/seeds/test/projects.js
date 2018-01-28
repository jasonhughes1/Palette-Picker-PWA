
exports.seed = function(knex, Promise) {

  return knex('palette').del()
    .then(() => knex('projects').del())
    .then(function () {

      return Promise.all([

        knex('projects').insert({
          projectName: 'project 1'
        }, 'id')
        .then(palette => {
          return knex('palette').insert([
            {
              projectName: 'Project1',
              paletteName: 'SweetColors',
              color1: '#577859',
              color2: '#47F71A',
              color3: '#57A16F',
              color4: '#5C240B',
              color5: '#82C7E3',
              projects_id: palette[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) //end promise.all
    });
};
