import { climbingGradeRank, formatGradeRange } from './grade-range'

describe('climbing grade ranges', () => {
  it('orders French grades from easiest to hardest', () => {
    expect(climbingGradeRank('5c')).toBeLessThan(climbingGradeRank('6a'))
    expect(climbingGradeRank('6a')).toBeLessThan(climbingGradeRank('6a+'))
    expect(climbingGradeRank('6a+')).toBeLessThan(climbingGradeRank('6b'))
  })

  it('keeps only the easiest and hardest grades', () => {
    expect(formatGradeRange(['6c', '5c', '6a+', '7b'])).toBe('5c – 7b')
  })

  it('shows one grade when the crag has only one distinct grade', () => {
    expect(formatGradeRange(['6c'])).toBe('6c')
    expect(formatGradeRange(['6c', '6c'])).toBe('6c')
  })

  it('ignores missing or invalid grades', () => {
    expect(formatGradeRange([null, '', 'inconnu'])).toBeNull()
  })
})
