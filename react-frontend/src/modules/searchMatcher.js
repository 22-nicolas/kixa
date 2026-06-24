export function matchesSearchText(name, searchText) {
    const target = normalizeSearchValue(name)
    const query = normalizeSearchValue(searchText)

    if (!query.compact) return true
    if (target.compact.includes(query.compact)) return true

    const acronym = target.tokens.map(token => token[0]).join("")
    if (query.compact.length > 1 && acronym.startsWith(query.compact)) return true

    return query.tokens.every(queryToken => {
        return target.tokens.some(targetToken => tokensMatch(targetToken, queryToken))
            || fuzzyCompactMatch(target.compact, queryToken)
    })
}

function normalizeSearchValue(value) {
    const text = String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()

    const tokens = text ? text.split(/\s+/) : []

    return {
        tokens,
        compact: tokens.join("")
    }
}

function tokensMatch(targetToken, queryToken) {
    if (targetToken.includes(queryToken)) return true

    if (queryToken.length <= 2) {
        return targetToken.startsWith(queryToken)
    }

    const maxDistance = getAllowedTypoCount(queryToken.length)
    if (getLevenshteinDistance(targetToken, queryToken) <= maxDistance) return true

    return isSubsequence(queryToken, targetToken)
        && queryToken.length / targetToken.length >= 0.6
}

function fuzzyCompactMatch(targetCompact, queryCompact) {
    if (queryCompact.length < 3) return false
    if (targetCompact.includes(queryCompact)) return true

    const maxDistance = getAllowedTypoCount(queryCompact.length)
    const shortestWindow = Math.max(1, queryCompact.length - maxDistance)
    const longestWindow = queryCompact.length + maxDistance

    for (let start = 0; start < targetCompact.length; start++) {
        for (let windowLength = shortestWindow; windowLength <= longestWindow; windowLength++) {
            const targetSlice = targetCompact.slice(start, start + windowLength)
            if (targetSlice.length < shortestWindow) continue
            if (getLevenshteinDistance(targetSlice, queryCompact) <= maxDistance) return true
        }
    }

    return false
}

function getAllowedTypoCount(length) {
    if (length <= 4) return 1
    if (length <= 8) return 2
    return 3
}

function getLevenshteinDistance(a, b) {
    const distances = Array.from({ length: b.length + 1 }, (_, index) => index)

    for (let i = 1; i <= a.length; i++) {
        let previousDiagonal = distances[0]
        distances[0] = i

        for (let j = 1; j <= b.length; j++) {
            const previousAbove = distances[j]
            const cost = a[i - 1] === b[j - 1] ? 0 : 1

            distances[j] = Math.min(
                distances[j] + 1,
                distances[j - 1] + 1,
                previousDiagonal + cost
            )
            previousDiagonal = previousAbove
        }
    }

    return distances[b.length]
}

function isSubsequence(needle, haystack) {
    let needleIndex = 0

    for (const char of haystack) {
        if (char === needle[needleIndex]) needleIndex++
        if (needleIndex === needle.length) return true
    }

    return false
}
