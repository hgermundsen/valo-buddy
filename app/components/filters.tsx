interface Props {
  filterNames: string[];
}
export default function Filters({ filterNames }: Props) {
  return (
    <div className="flex justify-between">
      <div className="flex space-x-4">
        {filterNames.map((filterName) => (
          <input
            key={filterName}
            type="button"
            name={filterName}
            value={filterName}
            className="px-4 py-2 bg-white/10 rounded-full ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 hover:cursor-pointer transition"
          />
        ))}
      </div>
      <input
        type="button"
        name="clear"
        value="Clear"
        className="px-4 py-2 bg-white/10 rounded-full ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 hover:cursor-pointer transition"
      />
    </div>
  );
}
