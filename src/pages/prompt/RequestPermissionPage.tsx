import { FC, useEffect, useState } from 'react'
import Button from '../../components/input/Button'
import { type Event as NostrEvent, finishEvent, nip19 } from 'nostr-tools'
import { Message, Popup } from '../../utils/types'
import { useNsecs } from '../../contexts/NsecContext'
import capitalizeFirstLetter from '../../utils/capitalize-first-letter'
import truncateKey from '../../utils/truncate-key'
import BlankPFP from '../../assets/images/blank-pfp.png'

interface RequestPermissionPageProps {
    data: Popup
}

const RequestPermissionPage: FC<RequestPermissionPageProps> = ({ data }) => {
    const { getActiveNsec, getActivePublicKey } = useNsecs()

    const [npub, setNpub] = useState<string | undefined>()
    const [eventToSign, setEventToSign] = useState<NostrEvent | undefined>()

    useEffect(() => {
        // Listen to receive the event to sign from the content script.
        if(data.request === 'signature') {
            const messageListener = (request: any, _sender: chrome.runtime.MessageSender, _sendResponse: (response: any) => void) => {
                console.log(request)
                setEventToSign(request)
            }
            chrome.runtime.onMessage.addListener(messageListener)
            // return () => chrome.runtime.onMessage.removeListener(messageListener)
        }
        
        fetchNpub()
    }, [])

    const fetchNpub = async () => {
        const activePublicKey = await getActivePublicKey()
        const npub = nip19.npubEncode(activePublicKey)
        setNpub(truncateKey(npub))
    }

    const confirm = async () => {
        switch(data.request) {
            case 'signature':
                await signEvent()
                break
            case 'public-key':
                await getPublicKey()
                break
            default:
                throw new Error('Unhandled request.')
        }
        window.close()
    }

    const cancel = () => {
        let responseMessage: Message

        switch(data.request) {
            case 'signature':
                responseMessage = {
                    target: 'signstr-nostr-provider',
                    type: 'SIGNATURE',
                    data: 'cancel'
                }
                break
            case 'public-key':
                responseMessage = {
                    target: 'signstr-nostr-provider',
                    type: 'ACTIVE_PUBLIC_KEY',
                    data: 'cancel'
                }
                break
            default:
                throw new Error('Unhandled request.')
        }

        chrome.tabs.sendMessage(data.tabId, responseMessage)
        window.close()
    }

    const signEvent = async () => {
        try {
            const activeNsec = await getActiveNsec()
            const privateKey = nip19.decode(activeNsec)
            if(typeof privateKey.data !== 'string') throw new Error('Invalid private key.')
            if(!eventToSign) throw new Error('No event to sign.')
            const signedEvent = finishEvent(eventToSign, privateKey.data)
            const responseMessage: Message = {
                target: 'signstr-nostr-provider',
                type: 'SIGNATURE',
                data: signedEvent
            }
            chrome.tabs.sendMessage(data.tabId, responseMessage)
        } catch(err) {
            throw err
        }
    }

    const getPublicKey = async () => {
        try {
            const publicKey = await getActivePublicKey()
            const responseMessage: Message = {
                target: 'signstr-nostr-provider',
                type: 'ACTIVE_PUBLIC_KEY',
                data: publicKey
            }
            chrome.tabs.sendMessage(data.tabId, responseMessage)
        } catch(err) {
            throw err
        }
    }

    return (
        <div className='relative h-screen flex flex-col justify-between overflow-hidden'>
            <div>
                <div className='mb-12'>
                    <h1 className='text-center text-xl font-semibold py-4 bg-stone-200'>
                        {`${capitalizeFirstLetter(data.action)} Request`}
                    </h1>
                </div>

                <div className='my-12 m-2 flex items-center justify-between gap-4'>
                    <img
                        src={BlankPFP}
                        className='w-[40px] h-[40px] rounded-full'
                    />
                    <div>
                        <p>{data.origin} is requesting a {data.action} from <strong>{npub}</strong>.</p>
                    </div>
                </div>

                {data.request === 'signature' && eventToSign &&
                    <div className='mb-24'>
                        <p className='m-2 text-center'>You are signing:</p>
                        <pre className='p-2 bg-stone-200'>{JSON.stringify(eventToSign, null, 2)}</pre>
                    </div>
                }
            </div>

            <div className='fixed bottom-0 left-0 z-10 w-full flex gap-2 p-2 bg-white'>
                <Button
                    variant='outlined'
                    className='w-full'
                    onClick={cancel}
                >
                    Cancel
                </Button>
                <Button
                    className='w-full'
                    onClick={confirm}
                    disabled={data.request === 'signature' && !eventToSign}
                >
                    Confirm
                </Button>
            </div>
        </div>
    )
}

export default RequestPermissionPage