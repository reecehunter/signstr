import { Dispatch, FC, SetStateAction } from 'react'
import { useNsecs } from '../../../contexts/NsecContext'
import RightArrowIcon from '../../../assets/icons/RightArrowIcon'

interface SettingsPageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

const SettingsPage: FC<SettingsPageProps>= ({ setPage }) => {
    const { getActiveNsec, setActiveNsec, removeNsec, getNsecs } = useNsecs()

    const signOut = async () => {
        try {
            const nsecs = await getNsecs()
            const activeNsec = await getActiveNsec()
            await removeNsec(activeNsec)
            await setActiveNsec(nsecs.length > 1 ? nsecs[0] : null)
            setPage('welcome')
            window.location.reload()
        } catch(err) {
            throw err
        }
    }

    const options = [
        { name: 'Accounts', onClick: () => setPage('settings-accounts') },
        // { name: 'Connections', onClick: () => {} },
        { name: 'Relays', onClick: () => setPage('settings-relays') },
        { name: 'Keys', onClick: () => setPage('settings-keys') },
        { name: 'Sign Out', onClick: signOut },
    ]

    return (
        <div>
            {options.map((option) => (
                <div
                    key={option.name}
                    className='px-2 py-4 cursor-pointer flex items-center justify-between border-b-[1px] border-stone-200'
                    onClick={option.onClick}
                >
                    <p className='text-[1rem] font-semibold'>{option.name}</p>
                    <RightArrowIcon />
                </div>
            ))}
        </div>
    )
}

export default SettingsPage