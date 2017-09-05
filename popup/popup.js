browser.tabs.query({
  currentWindow: true,
  active: true,
}).then(tabs => {
  const tab = tabs[0]
    , tabUrl = new URL(tab.url)

  let defaultSettings = {}
  defaultSettings[tabUrl.hostname] = {
      active: null,
      grids: [
        {
          label: '24@21',
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

  const grids = browser.storage.sync.get(tabUrl.hostname)

  grids.then((settings) => {
    const keys = Object.keys(settings)

    if (keys.length === 0) {
console.log('no settings')
      showCard('grid-create')

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
      $('#selected').options[index] = new Option(item.label, index)

    })

    showCard('grid-list')

    $('#selected').addEventListener('change', (event) => {
      grid.selected = event.target.selectedIndex
      save(settings)
    }, false)

    $('#action-manage').addEventListener('click', (event) => {
      grid.grids.map((item, index) => {
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

        $('#available-grids').appendChild(container)
      })
      showCard('grid-manage')
    }, false)
  }).catch((err) => {
    console.error(err)
  })
})


function $(selector)
{
  return document.querySelector(selector)
}

function $$(selector)
{
  return Array.from(document.querySelectorAll(selector))
}

function _()
{
  return browser.i18n.getMessage.apply(this, arguments)
}


function save(settings)
{
  browser.storage.sync.set(settings)
}


function showCard(id)
{

  $$('.card').map((card) => {
    if (card.id !== id) {
      card.classList.remove('active')
      return
    }

    card.classList.add('active')
  })
}
