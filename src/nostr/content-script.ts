// Inject window.nostr into the page
const injectNostr = () => {
    const moduleUrl = chrome.runtime.getURL('assets/nostr-provider.js')
    const script = document.createElement("script")
    script.setAttribute("async", "false")
    script.setAttribute("type", "module")
    script.setAttribute("src", moduleUrl)
    document.head.appendChild(script)
}
injectNostr()

// Receive messages to forward elsewhere
chrome.runtime.onMessage.addListener((event, _sender, _sendResponse) => {
    if(event.target !== 'signstr-nostr-provider') return
    window.postMessage(event, '*') // Forward to nostr-provider
})

// Receive messages to forward elsewhere
window.addEventListener('message', async (event) => {
    if(event.data.forContentScript === false) return // Ignore messages sent from this script
    switch(event.data.target) {
        case 'signstr-worker':
            const origin = event.origin
            event.data.data.origin = origin
            chrome.runtime.sendMessage(event.data) // Forward to service-worker
            break
        case 'signstr-nostr-provider':
            window.postMessage({ ...event.data, forContentScript: false }, '*') // Forward to nostr-provider
            break
    }
})