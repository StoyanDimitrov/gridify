browser.tabs.query({
  currentWindow: true,
  active: true,
}).then(tabs => {
  const tab = tabs[0]
    , tabUrl = new URL(tab.url)
    , grids = browser.storage.sync.get(tabUrl.hostname)

  setText('.settings-save', _('popup_settings_save'))

  grids.then(settings => {
    const keys = Object.keys(settings)

    if (keys.length === 0) {
      return
    }
    const grid = settings[keys[0]]

    setText('title, h1', _('popup_title'))

    setText('label[for="active"]', _('popup_settings_active'))

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
  })
})


function setText(selector, content)
{
  Array.from(document.querySelectorAll(selector)).map(item => {
    item.textContent = content
  })
}

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
