const ID_CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function validateIdCharacters(candidateId: string): boolean {
  return candidateId.split('').every((char) => ID_CHARACTER_SET.includes(char))
}
