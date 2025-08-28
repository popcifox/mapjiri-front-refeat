export default function Tabs({ value, onChange, items }) {
    return (
      <ul className="tabs">
        {items.map(it => (
          <li
            key={it.key}
            className={`tab ${value===it.key ? 'active' : ''}`}
            onClick={() => onChange(it.key)}
            role="button"
          >
            {it.label}
          </li>
        ))}
      </ul>
    )
  }
  