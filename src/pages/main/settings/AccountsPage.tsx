import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useNsecs } from '../../../contexts/NsecContext'
import truncateKey from '../../../utils/truncate-key'
import TrashIcon from '../../../assets/icons/TrashIcon'
import Button from '../../../components/input/Button'
import LoginIcon from '../../../assets/icons/LogInIcon'
import BlankPFP from '../../../assets/images/blank-pfp.png'

interface AccountsPageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

type Account = {
    npub: string
    name?: string
    image?: string
}

const AccountsPage: FC<AccountsPageProps>= ({ setPage }) => {
    const { getNsecs, getNpub, setActiveNsec } = useNsecs()

    const [accounts, setAccounts] = useState<(Account)[]>([])

    const switchAccount = async (targetNpub: string) => {
        try {
            const nsecs = await getNsecs()
            const output = nsecs.filter((nsec) => {
                const npub = getNpub(nsec)
                if(npub === targetNpub) return npub
            })
            if(!output[0]) throw new Error('Npub/Nsec not found.')
            await setActiveNsec(output[0])
            setPage('home')
            window.location.reload()
        } catch(err) {
            throw err
        }
    }

    useEffect(() => {
        const fetchNsecs = async () => {
            const nsecs = await getNsecs()
            const userInfo = await chrome.storage.local.get('user_info')
            console.log(userInfo)
            const output = nsecs.reduce((acc, nsec) => {
                const npub = getNpub(nsec)
                if(!npub) return acc
                if(userInfo?.user_info[npub]) {
                    acc.push({ ...userInfo.user_info[npub], npub: npub })
                }
                else acc.push({ npub: npub })
                return acc
            }, [] as any[])
            setAccounts(output)
        }
        fetchNsecs()
    }, [])

    return (
        <div>
            <div className='p-2 flex gap-2 border-b-[1px] border-stone-200'>
                <Button className='w-full text-md' onClick={() => setPage('register-name')}>Create Account</Button>
                <Button className='w-full text-md' variant='outlined' onClick={() => setPage('login')}>Add Account</Button>
            </div>

            {accounts?.map((account) => (
                <div
                    key={account.npub}
                    className='px-2 py-4 flex items-center justify-between border-b-[1px] border-stone-200'
                >
                    <div className='flex items-center gap-2'>
                        <img src={account.image ?? BlankPFP} className='w-[40px] h-[40px] rounded-full' />
                        <div>
                            <p className='text-lg font-bold text-stone-950'>{account.name ?? account.npub.substring(0, 10)}</p>
                            <p className='text-md text-stone-500'>{truncateKey(account.npub)}</p>
                        </div>
                    </div>
                    <div>
                        <span className='flex gap-2 items-center'>
                            <span
                                className='cursor-pointer p-2 rounded-full hover:bg-stone-200'
                                onClick={() => switchAccount(account.npub)}
                            >
                                <LoginIcon stroke='#0284c7' />
                            </span>
                            <span className='cursor-pointer p-2 rounded-full hover:bg-stone-200'>
                                <TrashIcon
                                    className='cursor-pointer'
                                    stroke='#ef4444'
                                />
                            </span>
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AccountsPage