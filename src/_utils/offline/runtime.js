// @flow

// Install ServiceWorker and AppCache in the end since it's not most important
// operation and if main code fails, we do not want it installed
import offlinePluginRuntime from "offline-plugin/runtime"

console.log("SW Event:", "Installing")
console.log('process.env.PHENOMIC_DISABLE_SW_RELOAD', process.env.PHENOMIC_DISABLE_SW_RELOAD)
offlinePluginRuntime.install({
  // you can specify here some code to respond to events
  // see here for more informations
  // https://www.npmjs.com/package/offline-plugin#runtime
  onInstalled: () => {
    console.log("SW Event:", "onInstalled")
  },
  onUpdating: () => {
    console.log("SW Event:", "onUpdating")
  },
  onUpdateReady: () => {
    console.log("SW Event:", "onUpdateReady")
    offlinePluginRuntime.applyUpdate()
  },
  onUpdated: () => {
    console.log("SW Event:", "onUpdated")
    if (process.env.PHENOMIC_DISABLE_SW_RELOAD) {
      console.log("stop hard reload")
      const anchors = document.getElementsByTagName("a");
      for (var i = 0; i < anchors.length; i++) {
        anchors[i].onclick = function(e) {
          e.preventDefault()
          // stop react router and just hard reload the clicked href to get new contents
          window.location.href = e.target.href
          return false;
        };
      }
    } else {
      window.location.reload()
    }
  },
  onUninstalled: () => {
    console.log("SW Event:", "onUninstalled")
  },
})
// See webpack configuration file for more offline options
