const fs = require('fs')
const readline = require('readline-sync')

const state = {
  url: null,
  fileData: null,
  key: null
}

let withSlug = {}

function askByValues() {
  state.url = readline.question(
    'Por favor passe o caminho do seu arquivo json: '
  )
  state.key = readline.question('Por qual key gostaria de criar o slug?\nR:')
}

async function readFile() {
  state.fileData = JSON.parse(
    await fs.readFileSync(new URL('file:///' + state.url), 'utf-8')
  )
}

function createSlug(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      return {
        [key]: obj[key].map(item => {
          return {
            slug: item[state.key]
              .trim()
              .split(' ')
              .join('-')
              .toLowerCase(),
            ...item
          }
        })
      }
    } else {
      return {
        slug: item[state.key]
          .trim()
          .split(' ')
          .join('-')
          .toLowerCase(),
        ...obj[key]
      }
    }
  }
}

function saveData(obj) {
  fs.writeFile(new URL('file:///' + state.url), JSON.stringify(obj), err => {
    if (err) throw err

    console.log(`Dados salvos em ${state.url}`)
  })
}

async function main() {
  await askByValues()
  await readFile()
  withSlug = await createSlug(state.fileData)
  await saveData(withSlug)
}

main()
