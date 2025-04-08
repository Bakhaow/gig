/* eslint-disable react/prop-types */
import { useState } from "react";
import { useApplyToOfferMutation } from "../../redux/api/offersApiSlice";
import { toast } from "react-toastify";

const ApplicationForm = ({ offerId, onClose }) => {
  const [message, setMessage] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [applyToOffer] = useApplyToOfferMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await applyToOffer({
        id: offerId,
        data: { message, proposedBudget },
      }).unwrap();

      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="application-form bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Apply to Offer</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded mb-4"
          placeholder="Your application message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          placeholder="Proposed budget"
          value={proposedBudget}
          onChange={(e) => setProposedBudget(e.target.value)}
          required
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
