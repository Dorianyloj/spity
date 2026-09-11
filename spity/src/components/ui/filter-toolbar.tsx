import { useId, type ReactNode } from 'react'
import { Filter, RotateCcw, Search } from 'lucide-react'
import Button from './button'
import { Card, CardContent } from './card'
import { cn } from '@/lib/class-names'

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
  onReset?: () => void
  resetLabel?: string
  showReset?: boolean
}

export default function FilterToolbar({
  countLabel,
  filters,
  onQueryChange,
  query,
  queryLabel = 'Recherche',
  queryPlaceholder = 'Rechercher...',
  onReset,
  resetLabel = 'Réinitialiser',
  showReset = false,
}: FilterToolbarProps) {
  const searchId = useId()

  return (
    <Card hover={false} className="w-full border-border/90">
      <CardContent className="p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          <label className="min-w-0 space-y-2 sm:col-span-3 xl:col-span-1">
            <span className="text-xs font-semibold text-muted-foreground">{queryLabel}</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
              <input
                id={searchId}
                className="spity-input h-12 pl-10"
                placeholder={queryPlaceholder}
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
              />
            </span>
          </label>

          <div className="grid gap-3 sm:col-span-3 sm:grid-cols-3 xl:col-span-3">
            {filters.map((filter, index) => (
              <label key={filter.label} className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">{filter.label}</span>
                <select
                  className={cn('spity-input h-12', filters.length === 1 && 'sm:max-w-xs')}
                  value={filter.value}
                  onChange={(event) => filter.onChange(event.target.value)}
                  aria-label={filter.label}
                >
                  {filter.options.map((option) => (
                    <option key={`${index}-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2.5">
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <Filter size={16} aria-hidden="true" />
            <span>{countLabel}</span>
          </div>
          {showReset && onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw size={15} aria-hidden="true" />
              {resetLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
