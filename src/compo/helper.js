export function CheckHeading(str){
    return /^(\*)(\*)(.*)\*$/.test(str)
}

export function ReplaceHeadingStart(str){
    return str.replace(/^(\*)(\*)|(\*)$/g,'')
}