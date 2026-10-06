import {
  useEffect,
  useState,
} from 'react'

type SearchBarProps = {
  value?: string
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchBar({
  value = '',
  onSearch,
  placeholder = 'Search your encrypted notes...',
}: SearchBarProps) {
  const [query, setQuery] =
    useState(value)

  useEffect(() => {
    setQuery(value)
  }, [value])

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const nextQuery =
      event.target.value

    setQuery(nextQuery)
    onSearch?.(nextQuery)
  }

  function handleClear() {
    setQuery('')
    onSearch?.('')
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform:
            'translateY(-50%)',
          color: '#6b7280',
          pointerEvents: 'none',
          fontSize: '16px',
        }}
      >
        🔍
      </div>

      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search notes"
        className="vault-input"
        style={{
          paddingLeft: '42px',
          paddingRight:
            query
              ? '42px'
              : '13px',
        }}
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform:
              'translateY(-50%)',
            width: '28px',
            height: '28px',
            border: 'none',
            borderRadius: '50%',
            background:
              'transparent',
            color: '#9ca3af',
            fontSize: '16px',
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}