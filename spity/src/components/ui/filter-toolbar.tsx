import type { ReactNode } from 'react'
import { Filter, Search } from 'lucide-react'
import { Card, CardContent } from './card'

type FilterOption = {
  label: string
  value: string
}

type SelectFilter = {
  label: string
  onChange: (value: string) => void
  options: FilterOption[]
  value: string
}

export interface FilterToolbarProps {
  countLabel: ReactNode
  filters: SelectFilter[]
  onQueryChange: (value: string) => void
  query: string
  queryLabel?: string
  queryPlaceholder?: string
}

export default function FilterToolbar({
  countLabel,
  filters,
  onQueryChange,
  query,
  queryLabel = 'Recherche',
  queryPlaceholder = 'Rechercher...',
}: FilterToolbarProps) {
  return (
    <Card hover={false}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <label className="min-w-0 flex-1 space-y-2">
            <span className="text-xs font-bold uppercase text-white/60">{queryLabel}</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                className="spity-input h-12 pl-10"
                placeholder={queryPlaceholder}
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
              />
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[660px]">
            {filters.map((filter) => (
              <label key={filter.label} className="space-y-2">
                <span className="text-xs font-bold uppercase text-white/60">{filter.label}</span>
                <select className="spity-input h-12" value={filter.value} onChange={(event) => filter.onChange(event.target.value)}>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-sm text-muted-foreground">
          <Filter size={16} />
          <span>{countLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}
