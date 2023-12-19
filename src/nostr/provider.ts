import { type Event as NostrEvent } from 'nostr-tools'
import { Message } from '../utils/types'

export const setNostrProvider = () => {
    const nostr = {
        async getPublicKey() {
            return new Promise<string>((resolve, reject) => {
                try {
                    const message: Message = {
                        target: 'signstr-worker',
                        type: 'GET_ACTIVE_PUBLIC_KEY',
                        data: {},
                    }

                    const messageListener = (e: MessageEvent) => {
                        if(e.data.target !== 'signstr-nostr-provider') return
                        if(e.data.type !== 'ACTIVE_PUBLIC_KEY') return
                        const publicKey = e.data.data
                        if(publicKey === 'cancel') return reject('User cancelled request.')
                        else resolve(publicKey)
                        window.removeEventListener('message', messageListener)
                    }

                    window.addEventListener('message', messageListener)

                    window.postMessage(message, '*') // Request public key from content-script
                } catch(err) {
                    reject(err)
                }
            })
        },

        async signEvent(event: NostrEvent) {
            return new Promise<{ sig: string; }>(async (resolve, reject) => {
                try {
                    const message: Message = {
                        target: 'signstr-worker',
                        type: 'GET_SIGNATURE',
                        data: event,
                    }

                    const messageListener = (e: MessageEvent) => {
                        if(e.data.target !== 'signstr-nostr-provider') return
                        if(e.data.type !== 'SIGNATURE') return
                        const signedEvent = e.data.data
                        if(signedEvent === 'cancel') return reject('User cancelled request.')
                        else resolve(signedEvent)
                        console.log('signed event:', signedEvent)
                        window.removeEventListener('message', messageListener)
                    }

                    window.addEventListener('message', messageListener)

                    window.postMessage(message, '*') // Request private key from content-script
                } catch(err) {
                    reject(err);
                }
            })
        },

        //
        nip04: {
            async encrypt(recipientHexPubKey: string, value: string) {
                return new Promise<string>((resolve, reject) => {
                    try {
                        console.log(recipientHexPubKey, value) // delete this line
                        // Generate or get the encrypted value
                        const encryptedValue = 'your-encrypted-value';
                        resolve(encryptedValue);
                    } catch(err) {
                        reject(err);
                    }
                })
            },
            async decrypt(senderHexPubKey: string, value: string) {
                return new Promise<string>((resolve, reject) => {
                    try {
                        console.log(senderHexPubKey, value) // delete this line
                        // Generate or get the decrypted value
                        const decryptedValue = 'your-decrypted-value';
                        resolve(decryptedValue);
                    } catch(err) {
                        reject(err);
                    }
                })
            }
        }
    }

    window.nostr = nostr
}

setNostrProvider()