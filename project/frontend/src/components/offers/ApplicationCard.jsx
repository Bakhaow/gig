/* eslint-disable react/prop-types */
import { useUpdateApplicationStatusMutation } from "../../redux/api/offersApiSlice";

const ApplicationCard = ({ application, offerId, onStatusUpdate, isOwner }) => {
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const handleStatusUpdate = async (status) => {
    try {
      await updateApplicationStatus({
        offerId,
        applicationId: application._id,
        status,
      }).unwrap();
      onStatusUpdate?.();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="application-card bg-white p-4 rounded-lg shadow border-l-4 relative overflow-hidden">
      {/* Status indicator bar */}
      <div
        className={`absolute top-0 left-0 w-1 h-full 
        ${
          application.status === "accepted"
            ? "bg-green-500"
            : application.status === "rejected"
            ? "bg-red-500"
            : "bg-gray-300"
        }`}
      ></div>

      <div className="ml-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img
              src={
                application.provider.profileImage ||
                `https://ui-avatars.com/api/?name=${application.provider.username}&background=random`
              }
              className="w-12 h-12 rounded-full border-2 border-white shadow"
              alt="Provider"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${application.provider.username}&background=random`;
              }}
            />
            <div>
              <h4 className="font-semibold text-lg">
                {application.provider.username}
                {isOwner && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Rating: {application.provider.rating}/5)
                  </span>
                )}
              </h4>
              <p className="text-sm text-gray-500">
                Applied {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status badge with icon */}
          <div className="flex items-center gap-2">
            <span
              className={`status-badge px-3 py-1 rounded-full text-sm 
              ${
                application.status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : application.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <i
                className={`mr-2 fas 
                ${
                  application.status === "accepted"
                    ? "fa-check-circle"
                    : application.status === "rejected"
                    ? "fa-times-circle"
                    : "fa-clock"
                }`}
              ></i>
              {application.status}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
            {application.message}
          </p>
          <div className="flex justify-between items-center">
            <p className="font-semibold text-blue-600">
              Proposed: ${application.proposedBudget}
            </p>
            {!isOwner && application.status === "pending" && (
              <span className="text-sm text-gray-500">Decision pending</span>
            )}
          </div>
        </div>

        {/* Action buttons with confirmation */}
        {isOwner && application.status === "pending" && (
          <div className="flex gap-2 mt-4 border-t pt-4">
            <button
              onClick={() => {
                if (window.confirm("Accept this application?")) {
                  handleStatusUpdate("accepted");
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <i className="fas fa-check"></i>
              Accept Proposal
            </button>
            <button
              onClick={() => {
                if (window.confirm("Reject this application?")) {
                  handleStatusUpdate("rejected");
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <i className="fas fa-times"></i>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
