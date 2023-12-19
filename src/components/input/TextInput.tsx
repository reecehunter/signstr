import { FC } from "react"

interface TextInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string
}

const TextInput: FC<TextInputProps> = ({ onChange, placeholder }) => {
    return (
        <input
            className='p-2 text-lg outline-none focus:border-sky-600 w-full rounded-sm border-[2px] focus:border-[2px] border-stone-400 bg-transparent'
            placeholder={placeholder}
            onChange={onChange}
        />
    )
}

export default TextInput