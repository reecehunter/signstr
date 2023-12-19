import { Dispatch, FC, SetStateAction } from 'react'
import Button from '../../../components/input/Button'
import { SubTitle, Title } from '../../../components/Typography'
import { useNsecs } from '../../../contexts/NsecContext'

interface RegisterPFPPageProps {
    setPage: Dispatch<SetStateAction<string | undefined>>
}

const RegisterPFPPage: FC<RegisterPFPPageProps> = ({ setPage }) => {
    const { createNsec } = useNsecs()

    const genPrivateKey = async () => {
        try {
            await createNsec()
            setPage('register-success')
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div className='p-5 h-full flex flex-col gap-5 items-center justify-center'>
            <div className='absolute top-0 p-5 w-full flex items-center justify-between border-b-[1px] border-stone-400'>
                <p
                    className='cursor-pointer text-lg'
                    onClick={() => setPage('register-name')}
                >
                    {'< Back'}
                </p>
                <p className='text-lg'>Step 2/3</p>
            </div>

            <div className='text-center'>
                <Title>Profile Picture</Title>
                <SubTitle>Add an image that symbolizes you.</SubTitle>
            </div>

            <Button
                variant='outlined'
                className='w-full'
                onClick={() => {}}
            >
                Upload Image
            </Button>

            <div className='w-full'>
                <Button
                    className='w-full'
                    onClick={() => genPrivateKey()}
                >
                    Continue
                </Button>
                <span onClick={() => genPrivateKey()}>
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

export default RegisterPFPPage