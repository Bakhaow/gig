import { useState } from "react";
import Loader from "../../components/Loader";
import { useGetFilteredOffersQuery } from "../../redux/api/offersApiSlice";
import OfferCard from "./OfferCard";
import { useGetAllCategoriesQuery } from "../../redux/api/categoriesApiSlice";

function PublicOfferList() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    minBudget: "",
    maxBudget: "",
    sortBy: "date:desc",
  });

  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetFilteredOffersQuery(filters);
  const { data: categoriesData } = useGetAllCategoriesQuery();

  const offers = responseData?.data || [];
  const categories = categoriesData?.data || [];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto mt-[8vh] p-4">
      <h2 className="text-2xl font-bold mb-4">All Offers ({offers.length})</h2>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search offers..."
            className="p-2 border rounded"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
          />

          <select
            className="p-2 border rounded"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="date:desc">By Date (Newest)</option>
            <option value="date:asc">By Date (Oldest)</option>
            <option value="budget:desc">By Budget (Highest)</option>
            <option value="budget:asc">By Budget (Lowest)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Min Budget"
            className="p-2 border rounded"
            name="minBudget"
            value={filters.minBudget}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            placeholder="Max Budget"
            className="p-2 border rounded"
            name="maxBudget"
            value={filters.maxBudget}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {isLoading && <Loader />}
      {isError && <div className="text-red-500">Error loading offers</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <OfferCard key={offer._id} offer={offer} />
        ))}
      </div>

      {!isLoading && offers.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No offers found matching your criteria
        </div>
      )}
    </div>
  );
}

export default PublicOfferList;
