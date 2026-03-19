export default function PriceFilterSidebar({ filters, selectedFilterId, onFilterChange }) {
  return (
    <aside className="w-full md:w-64 md:flex-shrink-0">
      <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm md:sticky md:top-24">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
          价格筛选
        </p>
        <div className="space-y-4">
          {filters.map((filter) => (
            <label key={filter.id} className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="price-filter"
                checked={selectedFilterId === filter.id}
                onChange={() => onFilterChange(filter.id)}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">{filter.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
