/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOfferApplications } from "../../features/offers/offerSlice";
import ApplicationCard from "./ApplicationCard";
import { useGetOfferByIdQuery } from "../../redux/api/offersApiSlice";

const ApplicationList = ({ offerId }) => {
  const dispatch = useDispatch();
  const { data: offerData } = useGetOfferByIdQuery(offerId);
  const { userInfo: user } = useSelector((state) => state.auth);
  const { applications, loading, error } = useSelector(
    (state) => state.offers.applicationStatus
  );

  useEffect(() => {
    if (offerData && user) {
      const isClientOwner =
        user?.role === "client" && offerData.client === user?._id;
      const isProviderApplicant =
        user?.role === "provider" &&
        offerData.appliedProviders.includes(user?._id);

      if (isClientOwner || isProviderApplicant) {
        dispatch(getOfferApplications(offerId));
      }
    }
  }, [offerId, dispatch, user, offerData]);

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user)
    return (
      <div className="text-red-500">Please login to view applications</div>
    );
  if (!offerData?.client && !user?._id) return null;

  // Authorization check
  const isAuthorized =
    (user.role === "client" && offerData.client === user._id) ||
    (user.role === "provider" && offerData.appliedProviders.includes(user._id));

  if (!isAuthorized) {
    return (
      <div className="text-red-500">Not authorized to view applications</div>
    );
  }

  return (
    <div className="application-list space-y-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application._id}
          application={application}
          offerId={offerId}
        />
      ))}
    </div>
  );
};

export default ApplicationList;
