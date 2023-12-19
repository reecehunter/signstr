export default (key: string) => {
    if(!key || key.length < 63) return '...'
    return key.substring(0, 10) + '...' + key.substring(key.length - 10, key.length)
}