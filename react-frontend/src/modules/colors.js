export const Colors = {
    black: 0,
    white: 1,
    red: 2,
    blue: 3,
    green: 4,
    yellow: 5
}

export function string(color) {
    return Object.keys(Colors)[color]
}