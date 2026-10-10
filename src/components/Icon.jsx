function Icon({ name }) {
  const paths = {
    home: "M3 10.7 12 3l9 7.7v8.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-8.8ZM8.5 21v-6h7v6",
    map: "M9 20.5 3.5 18V5.5L9 8l6-3 5.5 2.5V20L15 17l-6 3.5ZM9 8v12.5M15 5v12",
    plus: "M12 5v14M5 12h14",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 21a7.5 7.5 0 0 1 15 0",
    arrow: "M5 12h13M13 6l6 6-6 6",
  };
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default Icon;
