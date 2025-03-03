import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetOfferByIdQuery } from "../../redux/api/offersApiSlice";
import Loader from "../../components/Loader";

const OfferDetails = () => {
  const { id } = useParams();
  const { data: offerData, isLoading, isError } = useGetOfferByIdQuery(id);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading offer details</div>;

  const offer = offerData?.data;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-3">
      <button
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className="mr-2" /> Back to Offers
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 text-">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offer Image */}
          {offer.image && (
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          {/* Updated Offer Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{offer.title}</h1>
            <div className="prose mb-4">{offer.description}</div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Budget</h3>
                <p className="text-gray-600">
                  ${offer.budget}
                  {offer.budgetNegotiable &&
                    ` (Negotiable, Current Offer: $${offer.negotiationPrice})`}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <span
                  className={`px-2 py-1 rounded ${
                    offer.status === "open"
                      ? "bg-green-100 text-green-800"
                      : offer.status === "inProgress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {offer.status}
                </span>
              </div>
              {offer.expirationTime && (
                <div>
                  <h3 className="font-semibold">Expiration Time</h3>
                  <p className="text-red-600">
                    {new Date(offer.expirationTime).toLocaleDateString()}
                  </p>
                </div>
              )}
              {offer.restrictedToAdvancedProviders && (
                <div>
                  <p className="text-gray-600 font-semibold text-yellow-500">
                    Restricted to advanced providers only
                    <br />
                  </p>
                </div>
              )}

              {offer.appliedProviders?.length > 0 && (
                <div>
                  <p className="text-gray-600 font-semibold text-white">
                    {offer.appliedProviders.length} applications received
                  </p>
                </div>
              )}
              {/* Payment and Completion Status */}
              <div>
                <h3 className="font-semibold">Payment Status</h3>
                <p className="text-gray-600">
                  {offer.paymentStatus}{" "}
                  {offer.paymentAmount && `- $${offer.paymentAmount}`}
                </p>
                {offer.serviceCompletionProof && (
                  <p className="text-sm mt-2">Completion proof submitted</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
