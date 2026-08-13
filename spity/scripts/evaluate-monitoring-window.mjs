const percentage = (numerator, denominator) => denominator === 0
  ? null
  : Number((numerator * 100 / denominator).toFixed(3))

const asDate = (value) => {
  const date = new Date(value)

  return Number.isNaN(date.valueOf()) ? null : date
}

const percentile95 = (values) => {
  if (values.length === 0) {
    return null
  }

  const ordered = [...values].sort((left, right) => left - right)
  return ordered[Math.ceil(ordered.length * 0.95) - 1]
}

const isAvailable = (observation) => typeof observation.availability === 'boolean'
  ? observation.availability
  : observation.status !== 'unhealthy'

export const evaluateMonitoringWindow = ({ observations, now = new Date(), policy }) => {
  const evaluatedAt = asDate(now)

  if (!evaluatedAt || !policy?.probe?.intervalMinutes || !policy?.objectives?.availability) {
    throw new Error('La politique et la date d’évaluation sont requises pour calculer le SLO')
  }

  const objective = policy.objectives.availability
  const requestedStart = new Date(evaluatedAt.valueOf() - objective.windowDays * 24 * 60 * 60 * 1_000)
  const monitoringStart = asDate(policy.monitoringStartedAt) ?? requestedStart
  const windowStart = monitoringStart > requestedStart ? monitoringStart : requestedStart
  const intervalMs = policy.probe.intervalMinutes * 60 * 1_000
  const expectedSamples = Math.floor((evaluatedAt - windowStart) / intervalMs) + 1
  const validObservations = []
  let excludedObservations = 0

  for (const observation of observations) {
    const checkedAt = asDate(observation.checkedAt)

    if (!checkedAt || checkedAt < windowStart || checkedAt > evaluatedAt) {
      excludedObservations += 1
      continue
    }

    validObservations.push({ ...observation, checkedAt: checkedAt.toISOString() })
  }

  const availableSamples = validObservations.filter(isAvailable).length
  const unavailableSamples = validObservations.length - availableSamples
  const measuredAvailabilityPercent = percentage(availableSamples, validObservations.length)
  const coveragePercent = Math.min(100, percentage(validObservations.length, expectedSamples))
  const latencyValues = validObservations
    .map((observation) => observation.indicators?.latencyMs)
    .filter((latencyMs) => Number.isFinite(latencyMs))
  const latencyThresholdMs = policy.objectives.latency.thresholdMs
  const latencyBreaches = latencyValues.filter((latencyMs) => latencyMs > latencyThresholdMs).length
  const ready = validObservations.length >= objective.minimumObservedSamples
    && coveragePercent >= objective.minimumCoveragePercent
  const status = !ready
    ? 'insufficient-data'
    : measuredAvailabilityPercent >= objective.targetPercent
      ? 'compliant'
      : 'breach'

  return {
    schemaVersion: 1,
    evaluatedAt: evaluatedAt.toISOString(),
    status,
    alertable: status === 'breach',
    window: {
      startedAt: windowStart.toISOString(),
      endedAt: evaluatedAt.toISOString(),
      requestedDays: objective.windowDays,
    },
    availability: {
      targetPercent: objective.targetPercent,
      measuredPercent: measuredAvailabilityPercent,
      availableSamples,
      unavailableSamples,
      observedSamples: validObservations.length,
      expectedSamples,
      minimumObservedSamples: objective.minimumObservedSamples,
      minimumCoveragePercent: objective.minimumCoveragePercent,
      coveragePercent,
      ready,
    },
    latency: {
      thresholdMs: latencyThresholdMs,
      observedSamples: latencyValues.length,
      p95Ms: percentile95(latencyValues),
      breaches: latencyBreaches,
    },
    dataQuality: {
      excludedObservations,
      sourceObservations: observations.length,
    },
  }
}
