import { Dispatch, FC, SetStateAction } from 'react'
import Button from '../../../components/input/Button'
import { SubTitle, Title } from '../../../components/Typography'

interface RegisterSuccessPageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

const RegisterSuccessPage: FC<RegisterSuccessPageProps> = ({ setPage }) => {
    return (
        <div className='p-5 h-full flex flex-col gap-5 items-center justify-center'>
            <div className='absolute top-0 p-5 w-full flex items-center justify-between border-b-[1px] border-stone-400'>
                <p
                    className='cursor-pointer text-lg'
                    onClick={() => setPage('register-pfp')}
                >
                </p>
                <p className='text-lg'>Step 3/3</p>
            </div>

            <div className='text-center'>
                <Title>Success!</Title>
                <SubTitle>Your account has been created.</SubTitle>
            </div>

            <div className='w-full'>
                <Button
                    className='w-full'
                    onClick={() => setPage('home')}
                >
                    🎉 Finish
                </Button>
            </div>
        </div>
    )
}

export default RegisterSuccessPage