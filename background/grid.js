function Grid(tab)
{
  this.tab = tab

  this.APPLICABLE_PROTOCOLS = ['http:', 'https:']
  this.PAGE_ACTION_ICONS = {
      'off': {
          16: 'assets/page-action-off-16.png',
          32: 'assets/page-action-off-32.png',
      },
      'on': {
          16: 'assets/page-action-on-16.png',
          32: 'assets/page-action-on-32.png',
      }
    }

  this.getData = function() {
    const url = new URL(this.tab.url)

    if (! this.APPLICABLE_PROTOCOLS.includes(url.protocol)) {
      return
    }

    return browser.storage.sync.get(url.hostname)
      .then(settings => {
        let keys = Object.keys(settings)

        if (keys.length === 0) {
          return
        }

        settings = settings[url.hostname]

        keys = Object.keys(settings)

        if (! keys.includes('grids')
          || settings.grids.length === 0
        ) {
          // settings corrupted
console.log('settings corrupted')
          return
        }

        const selected = settings.selected || 0

        return {
          isActive: settings.isActive || false,
          grid: settings.grids[selected]
        }
      })
    .catch(err => {
      console.error(err)
    })
  }
}

Grid.prototype = {

  exists() {
    if (this.tab.status !== 'complete'
      || ! this.getData()
    ) {
      return false
    }

    return true
  },


  show() {
    this.getData()
      .then(grid => {

        let action = 'off'
        if (grid.isActive) {
          action = 'on'
        }

        browser.pageAction.setIcon({
          tabId: this.tab.id,
          path: this.PAGE_ACTION_ICONS[action]
        })

        browser.tabs.sendMessage(this.tab.id, {
          'action': action,
          'settings': grid.grid,
        })

        browser.pageAction.show(this.tab.id)
      })
    .catch(err => {
      browser.pageAction.hide(this.tab.id)
      console.log('No grid setup for this host')
    })
  }
}