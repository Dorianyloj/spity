const gradePattern = /^([3-9])([a-c])(\+)?$/

export const climbingGradeRank = (grade: string) => {
  const match = gradePattern.exec(grade.trim().toLowerCase())
  if (!match) return -1

  const [, level, letter, plus] = match
  const letterRank = ({ a: 1, b: 3, c: 5 } as const)[letter as 'a' | 'b' | 'c']

  return Number(level) * 10 + letterRank + (plus ? 1 : 0)
}

export const formatGradeRange = (grades: Array<string | null | undefined>) => {
  const sortedGrades = Array.from(
    new Set(
      grades
        .map((grade) => grade?.trim().toLowerCase() ?? '')
        .filter((grade) => climbingGradeRank(grade) >= 0),
    ),
  ).sort((first, second) => climbingGradeRank(first) - climbingGradeRank(second))

  if (sortedGrades.length === 0) return null
  if (sortedGrades.length === 1) return sortedGrades[0]

  return `${sortedGrades[0]} – ${sortedGrades.at(-1)}`
}
