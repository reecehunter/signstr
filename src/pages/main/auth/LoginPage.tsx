import { Dispatch, FC, SetStateAction, useState } from 'react'
import TextInput from '../../../components/input/TextInput'
import NDK, { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'
import { SubTitle, Title } from '../../../components/Typography'
import Button from '../../../components/input/Button'
import { nip19 } from 'nostr-tools'
import { useNsecs } from '../../../contexts/NsecContext'

interface LoginPageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

const LoginPage: FC<LoginPageProps> = ({ setPage }) => {
    const { addNsec } = useNsecs()

    const [nsec, setNsec] = useState<string>('')

    const submit = async () => {
        try {
            // Verify nsec
            const ndk = new NDK()
            const privateKey = nip19.decode(nsec)
            if(privateKey.type !== 'nsec') throw new Error('Invalid nsec.')
            const signer = new NDKPrivateKeySigner(privateKey.data)
            ndk.signer = signer
            await signer.blockUntilReady()
            // Add to chrome storage
            await addNsec(nsec)
            setPage('home')
        } catch (err) {
            throw err
        }
    }

    return (
        <div className='p-5 h-full flex flex-col gap-5 items-center justify-center'>
            <div className='absolute top-0 p-5 w-full flex items-center justify-between border-b-[1px] border-stone-400'>
                <p
                    className='cursor-pointer text-lg'
                    onClick={() => setPage('welcome')}
                >
                    {'< Back'}
                </p>
                <p className='text-lg'></p>
            </div>

            <div className='text-center'>
                <Title>Login</Title>
                <SubTitle>Enter your nsec key to log in.</SubTitle>
            </div>

            <TextInput
                placeholder='nsec••••••'
                onChange={e => setNsec(e.target.value)}
            />

            <div className='w-full'>
                <Button
                    className='w-full'
                    onClick={submit}
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default LoginPage