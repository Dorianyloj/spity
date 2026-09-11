import type { CragReportInput } from '../schemas'

export const conditionStateLabels = {
  sec: 'Sec',
  humide: 'Humide',
  attention: 'À surveiller',
  ferme: 'Fermé',
} as const

export type ConditionState = keyof typeof conditionStateLabels

const conditionPrefix = /^\[spity-condition:(sec|humide|attention|ferme)\]\n?/

export const formatConditionReport = (input: Extract<CragReportInput, { type: 'condition' }>) =>
  `[spity-condition:${input.conditionState}]\n${input.message || 'Conditions mises à jour par la communauté.'}`

export const parseConditionReport = (message: string) => {
  const match = message.match(conditionPrefix)

  if (!match) return { message, state: null }

  return {
    message: message.slice(match[0].length).trim(),
    state: match[1] as ConditionState,
  }
}
