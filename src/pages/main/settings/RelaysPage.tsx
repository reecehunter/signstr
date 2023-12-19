import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { SubTitle } from '../../../components/Typography'
import { useNsecs } from '../../../contexts/NsecContext'
import TrashIcon from '../../../assets/icons/TrashIcon'

interface RelaysPageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

const RelaysPage: FC<RelaysPageProps>= (/*{ setPage }*/) => {
    const { getRelays } = useNsecs()

    const [relays, setRelays] = useState<((string)[])>([])

    useEffect(() => {
        const fetchRelays = async () => {
            const output = await getRelays()
            setRelays(output)
        }
        fetchRelays()
    }, [])

    return (
        <div>
            {relays?.map((relay) => (
                <div
                    key={relay}
                    className='px-2 py-4 flex items-center justify-between cursor-pointer border-b-[1px] border-stone-200'
                    onClick={() => {}}
                >
                    <SubTitle>{relay}</SubTitle>
                    <span onClick={() => console.log('open confirmation. delete relay.')}>
                        <TrashIcon stroke='#ef4444' />
                    </span>
                </div>
            ))}
        </div>
    )
}

export default RelaysPage