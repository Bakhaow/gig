import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { useDeleteOfferMutation } from "../../redux/api/offersApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { useGetAllCategoriesQuery } from "../../redux/api/categoriesApiSlice";
import { useGetFilteredOffersQuery } from "../../redux/api/offersApiSlice";

function OfferList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    minBudget: "",
    maxBudget: "",
    sortBy: "date:desc",
  });
  const {
    data: responseData,
    refetch,
    isLoading,
    isError,
  } = useGetFilteredOffersQuery(filters);
  const [deleteOffer] = useDeleteOfferMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  const offers = responseData?.data || [];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading offers</div>;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await deleteOffer(id);
        refetch();
        toast.success("Offer deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container mx-[4rem] mt-[8vh]">
      <div className="flex flex-col md:flex-row">
        <div className="p-3">
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

          <div className="ml-[2rem] text-xl font-bold h-12">
            All Offers ({offers.length})
          </div>

          <div className="flex flex-wrap justify-around items-center">
            {offers.map((offer) => (
              <Link
                key={offer._id}
                to={`/admin/offers/update/${offer._id}`}
                className="block mb-4 overflow-hidden"
              >
                <div className="flex">
                  <div className="p-4 flex flex-col justify-around">
                    <div className="flex justify-between">
                      <h5 className="text-xl font-semibold mb-2">
                        {offer?.title}
                      </h5>

                      <p className="text-gray-400 text-sm">
                        {moment(offer.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>

                    <p className="text-gray-400 xl:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                      {offer?.description?.substring(0, 160)}...
                    </p>

                    <div className="flex justify-between">
                      <button
                        onClick={() =>
                          navigate(`/admin/offers/update/${offer._id}`)
                        }
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-yellow-700 rounded-lg hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                      >
                        Update offers
                        <svg
                          aria-hidden="true"
                          className="w-3.5 h-3.85 ml-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </button>
                      <div className="flex items-center gap-4">
                        <p>€{offer.budget}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(offer._id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Delete offer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="md:w-1/4 p-3 mt-2">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
}

export default OfferList;
