export interface Killable {
  getScoreValue(): number
  die(): void
}
