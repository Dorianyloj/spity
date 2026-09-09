import { FlowButton } from './flow-button'

export default function FlowButtonDemo() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Flow Button — actions principales</h3>
      <div className="flex flex-wrap items-center gap-4">
        <FlowButton text="Continuer" />
        <FlowButton text="Découvrir Spity" variant="outline" href="/" />
        <FlowButton text="Rejoindre Spity" variant="light" href="/register" />
        <FlowButton text="Enregistrer" isLoading />
        <FlowButton text="Indisponible" disabled />
      </div>
    </div>
  )
}
