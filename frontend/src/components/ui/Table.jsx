import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import styles from './Table.module.css';

export function Table({ columns, data, loading }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <span className={styles.skelRow} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>Nenhum registro encontrado.</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TableSearch({ value, onChange, placeholder = 'Pesquisar...' }) {
  return (
    <div className={styles.searchBox}>
      <Search size={16} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function Pagination({ page, total, limit, onPage }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <span className={styles.info}>{total} registros</span>
      <div className={styles.pages}>
        <button onClick={() => onPage(page - 1)} disabled={page <= 1}><ChevronLeft size={16} /></button>
        <span>{page} / {totalPages}</span>
        <button onClick={() => onPage(page + 1)} disabled={page >= totalPages}><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}
