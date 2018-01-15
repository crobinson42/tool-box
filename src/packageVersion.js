/*
*   cli git command to cut a release branch off the current branch
*   expects the current working tree to be clean and on `develop`
*   also uses the package.json version as the release branch number
*/

const path = require('path')
const pkg = require(path.join(process.cwd(), 'package.json'))
const inquirer = require('inquirer')
const shell = require('shelljs')
const changelog = require('changelog')

global.colors = require('colors')

if (!global.colors) global.colors = require('colors')

const PROJECT_ROOT_DIR = path.dirname('../')

console.log(``.padStart(pkg.name.length + 12, '*').bgBlue)
console.log(`   Project: ${pkg.name}`.inverse)

inquirer
  .prompt([
    {
      type: 'list',
      name: 'version',
      message: 'What type of release is this?',
      choices: [
        { name: 'Major', value: 'major' },
        { name: 'Minor', value: 'minor' },
        { name: 'Patch', value: 'patch' },
        { name: 'Not a versioned release', value: false },
      ],
    },
  ])
  .then(answers => {
    if (!answers.version) return

    console.log(`Bumping version and pushing a git tag`.blue.inverse)

    shell.exec(
      `npm version ${answers.version} && git push origin && git push origin --tags && npm publish`,
    )
  })
