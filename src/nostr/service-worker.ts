import { Message } from '../utils/types'

chrome.runtime.onMessage.addListener((event, sender, _sendResponse) => {
  if(event.target !== 'signstr-worker') return

  switch(event.type) {
    case 'GET_SIGNATURE':
      if(!sender.tab?.id) throw new Error('No tab id')
      if(!event.data.origin) throw new Error('No origin')
      chrome.windows.create({ // Open popup window to request private key for a signature
        url: chrome.runtime.getURL(`index.html?request=signature&origin=${event.data.origin}&action=signature&tabId=${sender.tab.id}`),
        type: "popup",
        width: 350,
        height: 500,
      }, (window) => { // Send the event to sign to the popup window when it loads
        if(!window) throw new Error('No window.')
        chrome.tabs.query({ windowId: window.id, active: true }, (tabs) => {
          if (!tabs[0].id) throw new Error('No tab id.')
          const tabId = tabs[0].id;
          const listener = (tabIdUpdated: number, changeInfo: chrome.tabs.TabChangeInfo) => {
            if (tabIdUpdated === tabId && changeInfo.status === 'complete') {
              chrome.tabs.sendMessage(tabId, event.data)
              chrome.tabs.onUpdated.removeListener(listener)
            }
          }
          chrome.tabs.onUpdated.addListener(listener)
        })
      })
      break

    case 'SIGNATURE': // Receive the private key
      const privateKeyData: Message = {
        target: 'signstr-nostr-provider',
        type: 'SIGNATURE',
        data: event.data
      }
      if(!sender.tab?.id) throw new Error('No tab id')
      chrome.tabs.sendMessage(sender.tab.id, privateKeyData) // Forward private key to content-script

      chrome.runtime.onMessage.addListener((event, _sender, _sendResponse) => {
        if(event.target !== 'signstr-nostr-provider') return
        window.postMessage(event, '*') // Forward to nostr-provider
      })
      break

    case 'GET_ACTIVE_PUBLIC_KEY':
      if(!sender.tab?.id) throw new Error('No tab id')
      if(!event.data.origin) throw new Error('No origin')
      chrome.windows.create({ // Open popup window to request public key
        url: chrome.runtime.getURL(`index.html?request=public-key&origin=${event.data.origin}&action=public key&tabId=${sender.tab.id}`),
        type: "popup",
        width: 350,
        height: 500,
      })
      break

    case 'ACTIVE_PUBLIC_KEY': // Receive the public key
      const publicKeyData: Message = {
        target: 'signstr-nostr-provider',
        type: 'ACTIVE_PUBLIC_KEY',
        data: event.data
      }
      if(!sender.tab?.id) throw new Error('No tab id')
      chrome.tabs.sendMessage(sender.tab.id, publicKeyData) // Forward public key to content-script

      chrome.runtime.onMessage.addListener((event, _sender, _sendResponse) => {
        if(event.target !== 'signstr-nostr-provider') return
        window.postMessage(event, '*') // Forward to nostr-provider
      })
      break
  }
})