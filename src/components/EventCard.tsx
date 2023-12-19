import { FC, useEffect, useState } from 'react'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import HomeIcon from '../assets/icons/HomeIcon'
import { SubTitle } from './Typography'
import { nip19 } from 'nostr-tools'
import truncateKey from '../utils/truncate-key'

interface EventCardProps {
    event: NDKEvent
    className?: string
}

interface InfoType {
    title: string
    description: string
    created_at: number | undefined
    kind: number | undefined
}

const EventCard: FC<EventCardProps> = ({ event, className }) => {
    const [info, setInfo] = useState<InfoType>({ title: '...', description: '...', kind: event.kind, created_at: event.created_at })

    const KIND_TO_ICON = {
        undefined: <HomeIcon width={16} className='mt-1' />,
        0: <HomeIcon width={16} className='mt-1' />,
        1: <HomeIcon width={16} className='mt-1' />,
        30023: <HomeIcon width={16} className='mt-1' />,
        3: <HomeIcon width={16} className='mt-1' />,
        6: <HomeIcon width={16} className='mt-1' />,
        7: <HomeIcon width={16} className='mt-1' />
    }

    useEffect(() => {
        const handleKind = async () => {
            let cardData: InfoType = { title: '', description: '', kind: info.kind, created_at: info.created_at }
            switch(event.kind) {
                case 0:
                    const sectionsEdited = Object.keys(JSON.parse(event.content)).join(', ')
                    cardData.title = 'Updated Profile'
                    cardData.description = sectionsEdited.charAt(0).toUpperCase() + sectionsEdited.slice(1).toLowerCase()
                    break
                case 1:
                case 30023:
                    cardData.title = 'New Post'
                    cardData.description = `"${event.content.substring(0, 50)}"`
                    break
                case 3:
                    if(event.tags[0][0] === 'p' && event.tags[0][1]) {
                        const npub = await nip19.npubEncode(event.tags[0][1])
                        cardData.title = 'Followed User'
                        cardData.description = truncateKey(npub)
                    }
                    break
                case 6:
                    cardData.title = 'Repost'
                    cardData.description = "You reposted a note."
                    break
                case 7:
                    cardData.title = 'Reaction'
                    cardData.description = "You reacted to a note."
                    break
                default:
                    cardData.title = 'Unknown Event'
                    cardData.description = "You performed an event not yet handled by Signstr."
                    break
            }
            if(!event.created_at) return
            setInfo({ ...cardData, created_at: event.created_at * 1000 })
        }
        handleKind()
    }, [])

    return (
        <article className={`flex gap-2 ${className}`}>
            {KIND_TO_ICON[info.kind as keyof typeof KIND_TO_ICON] || <HomeIcon className='w-6 h-6' />}
            <div className='w-full'>
                <div className='flex items-center gap-1'>
                    <p className='font-bold text-[0.9rem]'>{info.title}</p>
                    <SubTitle className='!text-xs'>•</SubTitle>
                    <SubTitle className='!text-xs'>{new Date(info.created_at ?? -1).toLocaleDateString()}</SubTitle>
                </div>
                <SubTitle className='!text-sm'>{info.description}</SubTitle>
            </div>
        </article>
    )
}

export default EventCard