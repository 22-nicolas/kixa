export const Brands = {
    Nike: 0,
    Adidas: 1,
    Rebook: 2,
    Asics: 3,
    Puma: 4,
}

export function string(brand) {
    return Object.keys(Brands)[brand]
}