// Génère un mot de passe lisible (sans caractères ambigus 0/O, 1/l/I) avec majuscule, minuscule, chiffre et symbole.
export function generatePassword(length = 12): string {
  const LOWER = 'abcdefghijkmnopqrstuvwxyz'
  const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const DIGITS = '23456789'
  const SYMBOLS = '@#$%'
  const ALL = LOWER + UPPER + DIGITS + SYMBOLS

  const rnd = (max: number) => {
    const buf = new Uint32Array(1)
    // Rejet pour éviter le biais du modulo
    const limit = Math.floor(0xffffffff / max) * max
    do { crypto.getRandomValues(buf) } while (buf[0] >= limit)
    return buf[0] % max
  }
  const pick = (set: string) => set[rnd(set.length)]

  const chars = [pick(LOWER), pick(UPPER), pick(DIGITS), pick(SYMBOLS)]
  while (chars.length < length) chars.push(pick(ALL))
  for (let i = chars.length - 1; i > 0; i--) {
    const j = rnd(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}
