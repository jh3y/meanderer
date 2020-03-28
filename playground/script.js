const { Meanderer } = window
const CONTAINER = document.querySelector('#container')
const WRAPPER = document.querySelector('.container__wrapper')
const RESET = document.getElementById('reset')
const RESET_DEMO = document.getElementById('reset-demo')
const PATH_EL = document.querySelector('#path-rep path')
// Inputs
const HEIGHT_INPUT = document.querySelector('[name="height"]')
const PATH_INPUT = document.querySelector('[name="path"]')
const WIDTH_INPUT = document.querySelector('[name="width"]')
const FORM = document.querySelector('form')
// Demo config
const PATH = 'M3 42C3 0 19 3 19 3l4 39S22 3 35 3s9 39 9 39'
const WIDTH = 47
const HEIGHT = 45

HEIGHT_INPUT.value = HEIGHT
PATH_INPUT.value = PATH
WIDTH_INPUT.value = WIDTH

let responsivePath = new Meanderer({
  path: PATH,
  width: WIDTH,
  height: HEIGHT,
})

// Set up responsive path handling
const setPath = () => {
  const scaledPath = responsivePath.generatePath(
    CONTAINER.offsetWidth,
    CONTAINER.offsetHeight
  )
  CONTAINER.style.setProperty('--path', `"${scaledPath}"`)
  PATH_EL.setAttribute('d', scaledPath)
}
const SizeObserver = new ResizeObserver(setPath)
SizeObserver.observe(CONTAINER)

// Set up drag and drop handling
const onFileDrop = (e) => {
  e.preventDefault()
  const file = e.dataTransfer.files[0]
  if (
    file.type === 'image/svg+xml' ||
    file.name.slice(file.name.length - 4) === '.svg'
  ) {
    // process the file.
    const reader = new FileReader()
    reader.onloadend = (response) => {
      try {
        // file.target.result is the SVG markup we want to use.
        const wrapper = document.createElement('div')
        wrapper.innerHTML = response.target.result
        const svg = wrapper.querySelector('svg')
        const path = wrapper.querySelector('path')
        const viewBox = svg.getAttribute('viewBox').split(' ') // 0 0 x2 y2
        const pathString = path.getAttribute('d')
        // At this point make responsivePath a new responsive path
        responsivePath = new Meanderer({
          path: pathString,
          width: viewBox[2],
          height: viewBox[3],
        })
        PATH_INPUT.value = pathString
        HEIGHT_INPUT.value = viewBox[3]
        WIDTH_INPUT.value = viewBox[2]
        setPath()
      } catch (e) {
        throw Error('Something went wrong', e)
      }
    }
    reader.readAsText(file)
  }
}
// Don't do anything on drag over
document.body.addEventListener('dragover', (e) => e.preventDefault())
// On drop, process file and take first path
document.body.addEventListener('drop', onFileDrop)

// Reset container
const resetContainer = (e) => {
  e.preventDefault()
  WRAPPER.removeAttribute('style')
}
RESET.addEventListener('click', resetContainer)
// Reset demo
const resetDemo = (e) => {
  e.preventDefault()
  responsivePath = new Meanderer({
    path: PATH,
    height: HEIGHT,
    width: WIDTH,
  })
  HEIGHT_INPUT.value = HEIGHT
  PATH_INPUT.value = PATH
  WIDTH_INPUT.value = WIDTH
  setPath()
}
RESET_DEMO.addEventListener('click', resetDemo)
// Handle form changes with event delegation
const handleChange = (e) => {
  const target = e.target
  if (target.type === 'checkbox') {
    if (target.name === 'threeD') {
      WRAPPER.style.setProperty('--rotation', target.checked ? 75 : 0)
      WRAPPER.style.setProperty(
        '--transform-style',
        target.checked ? 'preserve-3d' : 'none'
      )
      WRAPPER.style.setProperty(
        '--overflow',
        target.checked ? 'visible' : 'hidden'
      )
    }
    if (target.name === 'alternate') {
      WRAPPER.style.setProperty(
        '--animation-direction',
        target.checked ? 'alternate' : 'normal'
      )
    }
    if (target.name === 'svg') {
      WRAPPER.style.setProperty(
        '--svg-display',
        target.checked ? 'block' : 'none'
      )
    }
  }
  if (target.type === 'text' || target.type === 'number') {
    responsivePath = new Meanderer({
      path: PATH_INPUT.value,
      width: parseInt(WIDTH_INPUT.value, 10),
      height: parseInt(HEIGHT_INPUT.value),
    })
    setPath()
  }
}
FORM.addEventListener('input', handleChange)
