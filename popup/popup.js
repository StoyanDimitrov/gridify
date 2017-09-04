browser.tabs.query({
  currentWindow: true,
  active: true,
}).then(tabs => {
  const tab = tabs[0]
    , tabUrl = new URL(tab.url)

  let defaultSettings = {}
  defaultSettings[tabUrl.hostname] = {
      label: 'teh grid',
      isActive: true,
      selected: 0,
      grids: [
        {
          position: 'center',
          columnCount: 24,
          columnWidth: 38,
          columnColor: 'red',
          gutterWidth: 12,
          baselineHeight: 21,
          baselineColor: 'blue',
        },
      ],
    }

  const grids = browser.storage.sync.get(defaultSettings)

  grids.then((settings) => {
    const keys = Object.keys(settings)

    if (keys.length === 0) {
console.log('no settings')
      return
    }

    const grid = settings[keys[0]]

    // is active
    $('#active').checked = grid.isActive
    $('#active').addEventListener('change', (event) => {
      grid.isActive = event.target.checked
      save(settings)
    }, false)

    // selected
    grid.grids.map((item, index) => {
      $('#selected').options[index] = new Option(index, index)

      let input = document.createElement('input')
        , container = document.createElement('div')

      // inputs
      input.name = index
      input.value = JSON.stringify(item)
      input.addEventListener('input', event => {
        grid.grids[parseInt(event.target.name, 10)] = JSON.parse(event.target.value)

        save(settings)
      }, false)

      container.setAttribute('class', 'browser-style')
      container.appendChild(input)

      $('#grids').appendChild(container)
    })

    $('#selected').addEventListener('change', (event) => {
      grid.selected = event.target.selectedIndex
      save(settings)
    }, false)
  }).catch((err) => {
console.log(err)
  })
})


function $(selector)
{
  return document.querySelector(selector)
}

function _()
{
  return browser.i18n.getMessage.apply(this, arguments)
}


function save(settings)
{
  browser.storage.sync.set(settings)
}
