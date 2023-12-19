import { Dispatch, FC, SetStateAction } from 'react'
import Button from '../../../components/input/Button'
import { SubTitle, Title } from '../../../components/Typography'
import TextInput from '../../../components/input/TextInput'

interface WelcomePageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

const RegisterNamePage: FC<WelcomePageProps> = ({ setPage }) => {
    return (
        <div className='p-5 h-full flex flex-col gap-5 items-center justify-center'>
            <div className='absolute top-0 p-5 w-full flex items-center justify-between border-b-[1px] border-stone-400'>
                <p
                    className='cursor-pointer text-lg'
                    onClick={() => setPage('welcome')}
                >
                    {'< Back'}
                </p>
                <p className='text-lg'>Step 1/3</p>
            </div>

            <div className='text-center'>
                <Title>Username</Title>
                <SubTitle>What should we call you?</SubTitle>
            </div>

            <TextInput
                placeholder='Enter a username...'
                onChange={() => {}}
            />

            <div className='w-full'>
                <Button
                    className='w-full'
                    onClick={() => setPage('register-pfp')}
                >
                    Continue
                </Button>
                <span onClick={() => setPage('register-pfp')}>
                    <SubTitle
                        className='text-center cursor-pointer text-sm mt-2'
                    >
                        Skip
                    </SubTitle>
                </span>
            </div>
        </div>
    )
}

export default RegisterNamePage