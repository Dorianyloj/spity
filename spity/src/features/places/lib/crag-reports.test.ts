import { formatConditionReport, parseConditionReport } from './crag-reports'

describe('crag condition reports', () => {
  it('stores the condition metadata without showing it to climbers', () => {
    const report = formatConditionReport({
      falaiseId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e',
      type: 'condition',
      conditionState: 'humide',
      message: 'La dalle reste mouillée.',
    })

    expect(parseConditionReport(report)).toEqual({ state: 'humide', message: 'La dalle reste mouillée.' })
  })

  it('keeps older free text reports readable', () => {
    expect(parseConditionReport('Éboulement sur le sentier.')).toEqual({
      state: null,
      message: 'Éboulement sur le sentier.',
    })
  })
})
