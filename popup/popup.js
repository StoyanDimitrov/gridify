browser.tabs.query({
  currentWindow: true,
  active: true,
}).then(tabs => {
  const tab = tabs[0]
    , tabUrl = new URL(tab.url)

  let defaultSettings = {}
  defaultSettings[tabUrl.hostname] = {
      isActive: false,
      selected: null,
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
      showCard('grid-settings', 'create')

      $('#action-create').addEventListener('click', (event) => {
        let inputs = $$('#grid-settings input')
          , list = inputs.reduce((list, field) => {
              list[field.id] = field.value

              return list
            }, [])

        settings[tabUrl.hostname] = {}
        settings[tabUrl.hostname].grids = []
        settings[tabUrl.hostname].grids[0] = {
              label: list.label,
              position: 'center',
              columnCount: parseInt(list['col-num'], 10),
              columnWidth: parseInt(list['col-width'], 10),
              columnColor: list['col-color'],
              gutterWidth: parseInt(list['gtr-width'], 10),
              baselineHeight: parseInt(list['base-height'], 10),
              baselineColor: list['base-color'],
            }
        save(settings)
        window.location.reload()
      }, false)

      return
    }

    const grid = settings[keys[0]]

    // is active
    $('#active').checked = grid.isActive
    $('#active').addEventListener('change', (event) => {
      grid.isActive = event.target.checked
      save(settings)
    }, false)


    // list
    let div = document.createElement('div')
    grid.grids.map((item, index) => {
      div.classList.add('grid-item')
      div.textContent = item.label + ', ' + item.columnCount
      $('#grid-list-items').appendChild(div)
    })

    showCard('grid-list')

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

function save(settings)
{
  browser.storage.sync.set(settings)
}

function showCard(id, mode)
{
  $$('.card').map((card) => {
    if (card.id !== id) {
      card.classList.remove('active')
      card.removeAttribute('data-mode')
      return
    }

    card.classList.add('active')
    card.setAttribute('data-mode', mode)
  })
}
