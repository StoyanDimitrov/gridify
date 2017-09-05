'use strict'

/**
 * pageAction click event handler
 */
browser.pageAction.onClicked.addListener((tab) => {
  const url = new URL(tab.url)

  return browser.storage.sync.get(url.hostname)
    .then((settings) => {
      settings[url.hostname].isActive = ! settings[url.hostname].isActive

      browser.storage.sync.set(settings)
    })
  .catch((err) => {
    console.error(err)
  })
})


/**
 * Tab activated event handler
 */
browser.tabs.onActivated.addListener((active) => {
  browser.pageAction.hide(active.tabId)

  browser.tabs.get(active.tabId)
    .then((tab) => {
      const grid = new Grid(tab)

      if (! grid.exists()) {
        return
      }

      grid.show()
    })
  .catch((err) => {
    console.error(err)
  })
})

/**
 * Tab refresh event handler
 */
browser.tabs.onUpdated.addListener((tabId, change, tab) => {
  if (tabId !== tab.id) {
    return
  }

  const grid = new Grid(tab)

  if (! grid.exists()) {
    return browser.pageAction.hide(tab.id)
  }

  grid.show()
})


/**
 * Settings change listener
 */
browser.storage.onChanged.addListener((changes, area) => {
  browser.tabs.query({
    currentWindow: true,
    active: true,
  })
    .then((tabs) => {
      const tab = tabs[0]
      const grid = new Grid(tab)

      if (! grid.exists()) {
        browser.pageAction.hide(tab.id)
        return
      }

      grid.show()
    })
  .catch((err) => {
    console.error(err)
  })
})


/*
  const defaultSettings = {}
  defaultSettings[url.hostname] = {
    active: null,
    grids: [
      {
        label: 'CMS',
        position: 'center',
        columnCount: 24,
        columnWidth: 38,
        columnColor: 'red',
        gutterWidth: 12,
        baselineHeight: 21,
        baselineColor: 'blue',
      },
      {
        label: 'Site',
        position: 'center',
        columnCount: 12,
        columnWidth: 84,
        columnColor: 'red',
        gutterWidth: 15,
        baselineHeight: 24,
        baselineColor: 'blue',
      },
    ],
  }
*/
