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
  compactReset?: boolean
  countLabel: ReactNode
  filters: SelectFilter[]
  onQueryChange: (value: string) => void
  query: string
  queryLabel?: string
  queryPlaceholder?: string
  onReset?: () => void
  resetLabel?: string
  showCount?: boolean
  showReset?: boolean
}

export default function FilterToolbar({
  compactReset = false,
  countLabel,
  filters,
  onQueryChange,
  query,
  queryLabel = 'Recherche',
  queryPlaceholder = 'Rechercher...',
  onReset,
  resetLabel = 'Réinitialiser',
  showCount = true,
  showReset = false,
}: FilterToolbarProps) {
  const searchId = useId()
  const showInlineReset = compactReset && showReset && Boolean(onReset)

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

          <div
            className={cn(
              'grid gap-3 sm:col-span-3 sm:grid-cols-3 xl:col-span-3',
              compactReset &&
                'sm:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.2fr)]',
            )}
          >
            {filters.map((filter, index) => {
              const filterId = `${searchId}-filter-${index}`

              return (
                <div key={filter.label} className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground" htmlFor={filterId}>
                    {filter.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id={filterId}
                      className={cn('spity-input h-12 min-w-0 flex-1', filters.length === 1 && 'sm:max-w-xs')}
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
                    {showInlineReset && index === filters.length - 1 && (
                      <Button
                        aria-label={resetLabel}
                        className="size-10 shrink-0 p-0 text-muted-foreground"
                        onClick={onReset}
                        title={resetLabel}
                        variant="ghost"
                      >
                        <RotateCcw size={16} aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showCount || (!compactReset && showReset && onReset) ? <div className={cn('mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-secondary/60 px-3 py-2.5', showCount ? 'justify-between' : 'justify-end')}>
          {showCount ? <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <Filter size={16} aria-hidden="true" />
            <span>{countLabel}</span>
          </div> : <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{countLabel}</span>}
          {!compactReset && showReset && onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw size={15} aria-hidden="true" />
              {resetLabel}
            </Button>
          )}
        </div> : <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{countLabel}</span>}
      </CardContent>
    </Card>
  )
}
