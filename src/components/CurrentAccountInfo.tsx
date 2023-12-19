import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Title } from './Typography'
import { useNsecs } from '../contexts/NsecContext'
import NDK, { NDKFilter, profileFromEvent } from '@nostr-dev-kit/ndk'
import { nip19 } from 'nostr-tools'
import DownArrowIcon from '../assets/icons/DownArrowIcon'
import GlobeIcon from '../assets/icons/GlobeIcon'
import HomeIcon from '../assets/icons/HomeIcon'
import SettingsIcon from '../assets/icons/SettingsIcon'
import ActivityIcon from '../assets/icons/ActivityIcon'

interface CurrentAccountInfoProps {
    page: string
    setPage: Dispatch<SetStateAction<string | undefined>>
}

type UserInfo = {
    name: string | undefined
    image: string | undefined
}

const CurrentAccountInfo: FC<CurrentAccountInfoProps> = ({ page, setPage }) => {
    const { getActiveNsec, getNpub, getRelays } = useNsecs()

    const [activeNpub, setActiveNpub] = useState<string | null>(null)
    const [info, setInfo] = useState<UserInfo>({ name: undefined, image: undefined })

    const getPageIcon = () => {
        switch (page) {
            case 'home':
                return <HomeIcon width={20} stroke='#0284c7' />
            case 'activity':
                return <ActivityIcon width={20} stroke='#0284c7' />
            case 'settings':
                return <SettingsIcon width={20} stroke='#0284c7' />
            default:
                return <HomeIcon width={20} stroke='#0284c7' />
        }
    }

    const getActiveNpub = async () => {
        const nsec = await getActiveNsec()
        const npub = await getNpub(nsec)
        setActiveNpub(npub)
    }

    const getImgSrc = async () => {
        if(!activeNpub) return

        const cache = await getCache(activeNpub)
        if(cache && cache.last_updated + 5 * 60 * 1000 > cache.last_updated) {
            setInfo(cache)
            return
        }
        
        const publicKey = await nip19.decode(activeNpub).data
        if(typeof publicKey !== 'string') return
        
        const ndk = new NDK({
            explicitRelayUrls: await getRelays()
        })
        await ndk.connect()

        const filter: NDKFilter = {
            authors: [publicKey],
            limit: 1,
            kinds: [0],
        }

        const activity = await ndk.fetchEvents(filter)
        if(activity.size === 0) return

        const user = await profileFromEvent(activity.values().next().value)
        if(user.name && user.name.length > 13) user.name = user.name.substring(0, 13) + '...'

        const userInfo: UserInfo = { name: user.name, image: user.image }
        setInfo(userInfo)
        setCache(activeNpub, userInfo)
    }

    const setCache = async (npub: string, userInfo: UserInfo) => {
        try {
            const currentCache = await chrome.storage.local.get('user_info')
            console.log('current:', currentCache)
            await chrome.storage.local.set({
                user_info: {
                    ...currentCache.user_info,
                    [npub]: {
                        ...userInfo,
                        last_updated: Date.now()
                    }
                }
            })
        } catch(err) {
            throw err
        }
    }

    const getCache = async (npub: string) => {
        try {
            const res = await chrome.storage.local.get('user_info')
            if(!res.user_info) return null
            return res.user_info[npub]
        } catch(err) {
            throw err
        }
    }

    useEffect(() => {
        getActiveNpub()
    }, [])

    useEffect(() => {
        getImgSrc()
    }, [activeNpub])

    return (
        <div className='relative px-2 py-4 flex items-center justify-between gap-2 border-b-[1px] border-stone-200'>
            <div>
                {getPageIcon()}
            </div>
            <div className='absolute left-1/2 transform -translate-x-1/2 cursor-pointer flex items-center gap-2' onClick={() => setPage('settings-accounts')}>
                <div className='w-[25px] h-[25px] rounded-full overflow-hidden'>
                    <img
                        className='w-full h-full'
                        src={info.image || 'https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png'}
                    />
                </div>
                <Title className='text-lg font-bold'>{info.name || activeNpub?.substring(0, 10) || '...'}</Title>
                <DownArrowIcon stroke='#78716c' />
            </div>
            <div className='flex items-center gap-1'>
                <GlobeIcon width={20} stroke='red' />
            </div>
        </div>
    )
}

export default CurrentAccountInfo