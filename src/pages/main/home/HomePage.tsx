import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useNsecs } from '../../../contexts/NsecContext'

interface HomePageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

interface IDataItem {
    name: string
    value: number
    page: string
}

type IData = IDataItem[]

declare global {
    interface Window {
        webln: any; // TODO: Use the proper type.
    }
  }

const HomePage: FC<HomePageProps> = (/*{ setPage }*/) => {
    const { getRelays, getNsecs } = useNsecs()
            
    const [data, setData] = useState<IData | null>(null)
    data

    const getRelayCount = async () => {
        const relays = await getRelays()
        return relays.length
    }

    const getAccountCount = async () => {
        const accounts = await getNsecs()
        return accounts.length
    }

    const getAllData = async () => {
        setData([
            { name: 'Accounts', value: await getAccountCount(), page: 'settings-accounts' },
            { name: 'Relays', value: await getRelayCount(), page: 'settings-accounts' },
        ])
    }

    const receive = async () => {
        try {
            console.log('receive')
        } catch(err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getAllData()
    }, [])

    return (
        <div className='mx-2'>
            <div className='my-12 text-center'>
                <p className='text-4xl font-bold'>1,000,000</p>
                <p className='text-sm text-stone-500'>satoshis</p>
            </div>
            
            <div className='flex gap-2'>
                <button
                    className='w-full py-4 bg-stone-200'
                    onClick={() => receive()}
                >
                    Receive
                </button>
                <button
                    className='w-full py-4 bg-stone-200'
                    onClick={() => console.log('send satoshis')}
                >
                    Send
                </button>
            </div>

            {/* <div className='m-2 grid grid-cols-2 grid-rows-2 gap-2'>
                {data?.map((item) => (
                    <article
                        key={item.name}
                        className='cursor-pointer p-2 bg-stone-100 hover:bg-stone-200 rounded-sm text-center'
                        onClick={() => setPage(item.page)}
                    >
                        <p className='text-2xl font-semibold'>{item.value}</p>
                        <p className='text-xs text-stone-500'>{item.name}</p>
                    </article>
                ))}
            </div> */}
        </div>
    )
}

export default HomePage