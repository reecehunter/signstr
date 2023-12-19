import { Dispatch, FC, SetStateAction } from 'react'
import LogoImage from '../../../assets/images/logo copy.png'
import Button from '../../../components/input/Button'
import { SubTitle, Title } from '../../../components/Typography'

interface WelcomePageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

const WelcomePage: FC<WelcomePageProps> = ({ setPage }) => {
    return (
        <div className='p-5 h-full flex flex-col gap-5 items-center justify-center'>
            <div className='w-full flex items-center justify-center gap-5'>
                <img
                    className='w-[80px]'
                    src={LogoImage}
                />
                <div>
                    <Title>Signstr</Title>
                    <SubTitle>Your Nostr Companion</SubTitle>
                </div>
            </div>

            <hr className='my-5 w-full border-t-[1px] border-stone-400' />

            {/* <p className='text-lg text-[var(--text-1)]'>Connect, sign, encrypt, and more.</p> */}

            <Button
                className='w-full'
                onClick={() => setPage('register-name')}
            >
                Register
            </Button>

            <Button
                variant='outlined'
                className='w-full'
                onClick={() => setPage('login')}
            >
                Login
            </Button>
        </div>
    )
}

export default WelcomePage