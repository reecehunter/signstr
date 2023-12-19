export default (str: string) => {
    const output: string[] = []
    str.split(' ').map((word: string) => {
        output.push(word.charAt(0).toUpperCase() + word.slice(1))
    })
    return output.join(' ')
}