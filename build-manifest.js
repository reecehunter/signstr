import fs from 'fs'
import path from 'path'

const myManifest = {
    "manifest_version": 3,
    "name": "Signstr | Nostr Companion",
    "description": "The Nostr extension for passwordless logins and lightning payments anywhere on the internet.",
    "version": "1.0",
    "action": {
        "default_title": "Signstr | Nostr Companion",
        "default_popup": "index.html",
        "default_icon": "./logo.png"
    },
    "background": {
        "service_worker": "assets/service-worker.js",
        "type": "module"
    },
    "content_scripts": [
        {
        "js": ["assets/content-script.js"],
        "matches": ["<all_urls>"]
        }
    ],
    "web_accessible_resources": [
        {
        "resources": ["assets/*.js", "index.html"],
        "matches": ["<all_urls>"]
        }
    ],
    "permissions": ["storage"],
    "host_permissions": ["<all_urls>"]
}

const assetFiles = fs.readdirSync('dist/assets')
const serviceWorkerFile = assetFiles.find(file => file.startsWith('service-worker') && file.endsWith('.js'))
const contentScriptFile = assetFiles.find(file => file.startsWith('content-script') && file.endsWith('.js'))
const nostrProviderFile = assetFiles.find(file => file.startsWith('nostr-provider') && file.endsWith('.js'))

myManifest.background.service_worker = `assets/${path.basename(serviceWorkerFile)}`
myManifest.content_scripts[0].js[0] = `assets/${path.basename(contentScriptFile)}`

fs.rename(`dist/assets/${path.basename(nostrProviderFile)}`, 'dist/assets/nostr-provider.js', (err) => {
    if(err) throw err
})

const updatedData = JSON.stringify(myManifest, null, 2)

fs.writeFile('dist/manifest.json', updatedData, 'utf8', (err) => {
    if (err) throw err
})