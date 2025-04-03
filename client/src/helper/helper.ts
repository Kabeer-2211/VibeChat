export function getAvatarName(name: string): string {
    const words = name.split(' ');
    if (words.length > 1) {
        return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
    }
    return words[0].substring(0, 2).toUpperCase();
}