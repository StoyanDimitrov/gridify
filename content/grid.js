const Container = {

  tagName: 'grid',
  container: {},

  init() {
    this.container = document.createElement(this.tagName)
  },

  get() {
    return document.querySelector(this.tagName)
  },

  exists() {
    if (! this.get()) {
      return false
    }

    return true
  },

  show() {
    document.body.appendChild(this.container)
  },

  hide() {
    // triggers animation see animationend handler
    this.container.classList.add('inactive')
  },

  remove() {
    this.container.remove()
    this.container.removeAttribute('class')

    return this
  },

  setGrid(styles) {
    this.container.style.cssText = styles

    return this
  }
}

const Grid = {

  width: 0,

  patternUrl: null,

  init(settings, patternUrl) {
    this.width = (settings.columnCount * settings.columnWidth) + ((settings.columnCount - 1) * settings.gutterWidth)
    this.patternUrl = patternUrl

    return this
  },

  fill() {
    const styles = 'width:' + this.width + 'px;margin-left:-' + (this.width / 2) + 'px;background-image:url(\'' + this.patternUrl + '\')'

    delete this.patternUrl

    return styles
  }
}

const Pattern = {

  pattern: null,

  fill(geometry, settings) {
    geometry.height = Math.max(1, geometry.height) - .5

    this.pattern = '<svg xmlns="http://www.w3.org/2000/svg" width="' + geometry.width + '" height="' + settings.baselineHeight + '"><rect style="fill:rgba(242,5,13,.12)" width="' + settings.columnWidth + '" height="' + (settings.baselineHeight - 1) + '"/><line style="stroke:rgba(217,4,11,.77)" y1="' + geometry.height + '" x2="100%" y2="' + geometry.height + '"/></svg>'

    return this
  },

  getUrl() {
    return 'data:image/svg+xml;utf8,' + this.pattern
  }
}

function getGrid(settings)
{
  const patternUrl = Pattern.fill({
    width: parseInt(settings.columnWidth + settings.gutterWidth, 10),
    height: settings.baselineHeight,
  }, {
    columnWidth: settings.columnWidth,
    baselineHeight: settings.baselineHeight,
  }).getUrl()

  return Grid.init(settings, patternUrl).fill()
}


browser.runtime.onMessage.addListener((message) => {
  if (! message.action
    || ! message.settings
  ) {
    // invalid message format
    return
  }

  if (message.action === 'off') {
    return Container.hide()
  }

  Container
    .remove()
    .setGrid(getGrid(message.settings))
    .show()
})

Container.init()

window.addEventListener('animationend', (event) => {
  if (event.animationName !== 'grid-hide') {
    return
  }

  Container.remove()
}, false)
