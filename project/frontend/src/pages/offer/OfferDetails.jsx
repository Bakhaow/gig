import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  useGetOfferByIdQuery,
  useApplyToOfferMutation,
  useGetOfferApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "../../redux/api/offersApiSlice";
import Loader from "../../components/Loader";
import { useState } from "react";
import ApplicationForm from "../../components/offers/ApplicationForm";
import ApplicationCard from "../../components/offers/ApplicationCard";
import { useSelector } from "react-redux";

const OfferDetails = () => {
  const { id } = useParams();
  const { data: offerData, isLoading, isError } = useGetOfferByIdQuery(id);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const { data: applicationsData, refetch } = useGetOfferApplicationsQuery(id);
  const [applyToOffer] = useApplyToOfferMutation();
  // eslint-disable-next-line no-unused-vars
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();
  const { userInfo } = useSelector((state) => state.auth);

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

      {offer.isLocked && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex items-center gap-3">
            <i className="fas fa-lock text-yellow-500 text-xl"></i>
            <div>
              <h3 className="font-semibold text-yellow-800">Offer Locked</h3>
              <p className="text-yellow-700 text-sm">
                This offer has selected a provider and is no longer accepting
                applications
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Application Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Applications</h2>
          {userInfo?.role === "provider" &&
            offer.status === "open" &&
            !offer.isLocked && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 mb-2">
                  This offer is accepting applications until{" "}
                  {new Date(offer.expirationTime).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <i className="fas fa-paper-plane"></i>
                  Submit Your Proposal
                </button>
              </div>
            )}
        </div>

        {showApplyForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <ApplicationForm
              offerId={id}
              onClose={() => setShowApplyForm(false)}
              onSubmit={(data) => applyToOffer({ id, data })}
            />
          </div>
        )}

        <div className="space-y-4">
          {applicationsData?.data?.length === 0 ? (
            <div className="text-gray-500 p-4 text-center">
              {userInfo?.role === "client"
                ? "No applications received yet"
                : "You haven't applied to this offer"}
            </div>
          ) : (
            applicationsData?.data?.map((application) => {
              if (
                userInfo?.role === "provider" &&
                application.provider._id !== userInfo?._id
              ) {
                return null;
              }
              return (
                <ApplicationCard
                  key={application._id}
                  offerId={id}
                  application={application}
                  isOwner={userInfo?._id === offer.client}
                  onStatusUpdate={() => refetch()}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
