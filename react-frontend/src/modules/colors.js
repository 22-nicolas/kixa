export const Colors = ["black", "white", "red", "blue", "green", "yellow"]

export function string(color) {
    return Object.keys(Colors)[color]
}