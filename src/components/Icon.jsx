const paths = {
  search: 'M21 21l-4.5-4.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  retry: 'M20 7v5h-5M4 17v-5h5M6.1 6.1a8 8 0 0 1 13 2.4M4.9 15.5a8 8 0 0 0 13 2.4',
  warning: 'M12 8v5m0 4h.01M10.3 3.9 1.8 18.5a1.7 1.7 0 0 0 1.5 2.5h17.4a1.7 1.7 0 0 0 1.5-2.5L13.7 3.9a2 2 0 0 0-3.4 0'
};

export const Icon = ({ name, className = '' }) => (
  <svg className={`icon ${className}`} viewBox='0 0 24 24' fill='none'
    stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'
    aria-hidden='true' focusable='false'>
    <path d={paths[name]} />
  </svg>
);
