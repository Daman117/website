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
    {/* One real <table> at every width — the wrapper's overflow-x lets it
        scroll sideways on narrow screens rather than reflowing to cards. */}
    <table className="engram-table">
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
  </div>
));

export default ComparisonTable;
