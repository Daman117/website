import React from 'react';

interface ComparisonTableProps {
  wrapClassName: string;
  headers: [string, string, string];
  accentHeaderClassName: string;
  rows: [string, string, string][];
  cellClassNames: [string, string, string];
  getRowRef: (index: number) => (el: HTMLTableRowElement | null) => void;
}

const ComparisonTable = React.forwardRef<HTMLDivElement, ComparisonTableProps>(({
  wrapClassName, headers, accentHeaderClassName, rows, cellClassNames, getRowRef,
}, ref) => (
  <div ref={ref} className={`card engram-card ${wrapClassName}`}>
    {/* Desktop — the real <table>, untouched, GSAP row refs still attach here */}
    <table className="engram-table u-hide-mobile">
      <thead>
        <tr>
          <th className="tag-text">{headers[0]}</th>
          <th className="tag-text">{headers[1]}</th>
          <th className={`tag-text ${accentHeaderClassName}`}>{headers[2]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} ref={getRowRef(i)}>
            <td className={cellClassNames[0]}>{row[0]}</td>
            <td className={cellClassNames[1]}>{row[1]}</td>
            <td className={cellClassNames[2]}>{row[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Mobile — one card per row, fields labeled from the same headers.
        No row refs: the GSAP reveal above targets desktop <tr> elements
        specifically, mobile cards don't need a second animation wired up. */}
    <div className="engram-table-cards u-hide-desktop">
      {rows.map((row, i) => (
        <div key={i} className="engram-table-card">
          <div className="engram-table-card-field">
            <span className="engram-table-card-label">{headers[0]}</span>
            <span className={cellClassNames[0]}>{row[0]}</span>
          </div>
          <div className="engram-table-card-field">
            <span className="engram-table-card-label">{headers[1]}</span>
            <span className={cellClassNames[1]}>{row[1]}</span>
          </div>
          <div className="engram-table-card-field">
            <span className={`engram-table-card-label ${accentHeaderClassName}`}>{headers[2]}</span>
            <span className={cellClassNames[2]}>{row[2]}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
));

export default ComparisonTable;
