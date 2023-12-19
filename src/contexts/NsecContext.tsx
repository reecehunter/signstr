import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools'
import React, { createContext, useContext, FC } from 'react'

interface NsecsContextProps {
  addNsec: (nsec: string) => Promise<string[]>
  createNsec: () => Promise<string[]>
  removeNsec: (nsec: string) => Promise<void>
  getNsecs: () => Promise<string[]>
  getActiveNsec: () => Promise<string>
  setActiveNsec: (nsec: string | null) => Promise<void>
  getActivePublicKey: () => Promise<string>
  getActiveNpub: () => Promise<string>
  getNpub: (nsec: string) => string | null
  getRelays: () => Promise<string[]>
}

interface NsecsProviderProps {
    children: React.ReactNode
}

const NsecsContext = createContext<NsecsContextProps | undefined>(undefined)

export const NsecsProvider: FC<NsecsProviderProps> = ({ children }) => {

  const addNsec = (nsec: string): Promise<string[]> => new Promise(async (resolve, reject) => {
    try {
      const storage = await chrome.storage.local.get(['nsecs'])
      const nsecs = storage.nsecs ? [...storage.nsecs, nsec] : [nsec]
      await chrome.storage.local.set({ nsecs })
      await setActiveNsec(nsec)
      resolve(nsecs)
    } catch(err) {
      reject(err)
    }
  })
    
  const createNsec = (): Promise<string[]> => new Promise(async (resolve, reject) => {
    const privateKey = await generatePrivateKey()
    const nsec = await nip19.nsecEncode(privateKey)
    try {
      const nsecs = await addNsec(nsec)
      await chrome.storage.local.set({ relays: ['wss://relay.primal.net', 'wss://relay.snort.social', 'wss://relay.damus.io', 'wss://nos.lol', 'wss://nostr.wine'] })
      resolve(nsecs)
    } catch(err) {
      reject(err)
    }
  })

  const removeNsec = (nsec: string): Promise<void> => new Promise(async (resolve, reject) => {
    try {
      const storage = await chrome.storage.local.get(['nsecs'])
      const nsecs = storage.nsecs.filter((item: string) => item !== nsec)
      await chrome.storage.local.set({ nsecs })
      resolve()
    } catch(err) {
      reject(err)
    }
  })

  const getNsecs = (): Promise<string[]> => new Promise(async (resolve, reject) => {
    try {
        const storage = await chrome.storage.local.get(['nsecs'])
        resolve(storage.nsecs)
    } catch(err) {
        reject(err)
    }
  })

  const getActiveNsec = (): Promise<string> => new Promise(async (resolve, reject) => {
    try {
        const storage = await chrome.storage.local.get(['active'])
        resolve(storage.active)
    } catch(err) {
        reject(err)
    }
  })

  const setActiveNsec = (nsec: string | null): Promise<void> => new Promise(async (resolve, reject) => {
    try {
        await chrome.storage.local.set({ active: nsec })
        resolve()
    } catch(err) {
        reject(err)
    }
  })

  const getActivePublicKey = (): Promise<string> => new Promise(async (resolve, reject) => {
    getActiveNsec()
      .then((activeNsec) => {
      const privateKey = nip19.decode(activeNsec)
      if(typeof privateKey.data !== 'string') return reject('No private key found.')
      const publicKey = getPublicKey(privateKey.data)
      resolve(publicKey)
    })
    .catch((err) => reject(err))
  })

  const getActiveNpub = (): Promise<string> => new Promise(async (resolve, reject) => {
    getActiveNsec()
      .then((activeNsec) => {
      const privateKey = nip19.decode(activeNsec)
      if(typeof privateKey.data !== 'string') return reject('No private key found.')
      const publicKey = getPublicKey(privateKey.data)
      const npub = nip19.npubEncode(publicKey)
      resolve(npub)
    })
    .catch((err) => reject(err))
  })

  const getNpub = (nsec: string): string | null => {
    const privateKey = nip19.decode(nsec)
    if(typeof privateKey.data !== 'string') {
        console.error('privateKey.data is not a string')
        return null
    }
    const publicKey = getPublicKey(privateKey.data)
    const npub = nip19.npubEncode(publicKey)
    return(npub)
  }

  const getRelays = (): Promise<string[]> => new Promise(async (resolve, reject) => {
    try {
        const storage = await chrome.storage.local.get(['relays'])
        resolve(storage.relays)
    } catch(err) {
        reject(err)
    }
  })

  return (
    <NsecsContext.Provider value={{
      addNsec, createNsec, removeNsec, getNsecs, getActiveNsec, setActiveNsec, getActivePublicKey, getActiveNpub, getNpub, getRelays
    }}>
      {children}
    </NsecsContext.Provider>
  )
}

export const useNsecs = () => {
  const context = useContext(NsecsContext)
  if (context === undefined) {
    throw new Error('useNsecs must be used within a NsecsProvider')
  }
  return context
}