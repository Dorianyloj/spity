import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/class-names'

export type GradeLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'elite'

export interface GradeBadgeProps extends HTMLAttributes<HTMLDivElement> {
  grade: string
  level?: GradeLevel
}

// Fonction pour déterminer le niveau basé sur la cotation
const getGradeLevel = (grade: string): GradeLevel => {
  const gradeNum = parseInt(grade)

  if (isNaN(gradeNum)) return 'beginner'

  if (gradeNum <= 4) return 'beginner'
  if (gradeNum <= 5) return 'intermediate'
  if (gradeNum <= 6) return 'advanced'
  if (gradeNum <= 7) return 'expert'
  return 'elite'
}

const GradeBadge = forwardRef<HTMLDivElement, GradeBadgeProps>(
  ({ className = '', grade, level, ...props }, ref) => {
    const detectedLevel = level || getGradeLevel(grade)

    return (
      <div
        ref={ref}
        className={cn('grade-badge', `grade-badge--${detectedLevel}`, className)}
        aria-label={`Cotation ${grade}`}
        {...props}
      >
        {grade}
      </div>
    )
  }
)

GradeBadge.displayName = 'GradeBadge'

export default GradeBadge
