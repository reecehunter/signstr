import { FC, useEffect, useState } from 'react'
import { useNsecs } from '../../../contexts/NsecContext'
import NDK, { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk'
import { nip19 } from 'nostr-tools'
import EventCard from '../../../components/EventCard'
import EventCardSkeleton from '../../../components/skeleton/EventCardSkeleton'

type ActivityCache = {
    data: NDKEvent[],
    last_check: number
}

const ActivityPage: FC = () => {
    const { getActiveNsec, getRelays, getNpub } = useNsecs()

    const [recentActivity, setRecentActivity] = useState<NDKEvent[] | null>(null)
    const [fetching, setFetching] = useState<boolean>(false)

    const fetchActivity = async () => {
        const activity: ActivityCache = await getCache()
        const fiveMinutesLater = activity.last_check + 5 * 60 * 1000
        if(fiveMinutesLater > activity.last_check) {
            setRecentActivity(activity.data)
            return
        }

        try {
            setFetching(true)
            const ndk = new NDK({
                explicitRelayUrls: await getRelays()
            })

            await ndk.connect()

            const npub = getNpub(await getActiveNsec())
            if(!npub) return

            const decodedResult = await nip19.decode(npub)
            const hexPubKey = decodedResult.data
            if(typeof hexPubKey !== 'string') return

            const filter: NDKFilter = {
                authors: [hexPubKey],
                limit: 25,
                // kinds: [0, 1, 3, 7, 16, 9734, 9735, 9802, 10000, 10002, 30023, 30022],
            }

            const activity = await ndk.fetchEvents(filter)
            
            const output = []
            for(const event of activity) {
                output.push(event)
            }

            setRecentActivity(output)
            setCache(output)
        } catch(err) {
            console.error('Error connecting to relays:', err)
        } finally {
            setFetching(false)
        }
    }

    const setCache = async (events: NDKEvent[]) => { // TODO: SET CACHE PER ACCOUNT.
        try {
            const data = events.map(event => ({
                content: event.content,
                kind: event.kind,
                created_at: event.created_at,
                tags: event.tags
            }))
            const dataWithDate = { data: data, last_check: Date.now() }
            const dataString = JSON.stringify(dataWithDate)
            await chrome.storage.local.set({ recentActivity: dataString })
        } catch(err) {
            throw err
        }
    }

    const getCache = async () => {
        try {
            const { recentActivity } = await chrome.storage.local.get('recentActivity')
            if(!recentActivity) return null
            const parsedActivity = JSON.parse(recentActivity)
            return parsedActivity
        } catch(err) {
            throw err
        }
    }

    useEffect(() => {
        fetchActivity()
    }, [])

    return (
        <div className='overflow-auto'>
            {fetching &&
                <div className='py-2 border-b-[1px] border-stone-200'>
                    <p className='text-center text-xs text-stone-500'>Fetching new events...</p>
                </div>
            }

            {recentActivity && recentActivity.length > 0 ?
                recentActivity.map((event, index) => (
                    <EventCard
                        key={'key'} 
                        event={event}
                        className={`p-4 ${ index === 0 ? 'pt-2' : ''} border-b-[1px] border-stone-200`}
                    />
            )) : recentActivity && recentActivity.length === 0 ? 'No activity on the configured relays yet.'
            : <div>
                {[1, 2, 3, 4].map((skeleton, index) => (
                    <EventCardSkeleton
                        key={skeleton + index}
                        className={`p-4 ${ index === 0 ? 'pt-2' : ''} border-b-[1px] border-stone-200`}
                    />
                ))}
            </div>}
        </div>
    )
}

export default ActivityPage