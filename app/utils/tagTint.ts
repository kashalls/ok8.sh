const TINTS = ['var(--sky)', 'var(--mint)', 'var(--pastel-peach)', 'var(--pastel-lilac)', 'var(--pastel-butter)']

/** A pastel for a tag, picked from its name so a tag is the same colour on every post. */
export const tagTint = (tag: string) =>
    TINTS[[...tag.toLowerCase()].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7) % TINTS.length]
