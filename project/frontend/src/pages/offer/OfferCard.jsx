/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import moment from "moment";

function OfferCard({ offer }) {
  return (
    <div key={offer._id} className="border rounded-lg p-4 shadow-md">
      <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
      <p className="text-gray-600 mb-2">
        {moment(offer.createdAt).format("MMMM Do YYYY")}
      </p>
      <p className="text-gray-700 mb-4">
        {offer.description.substring(0, 160)}...
      </p>
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">€{offer.budget}</p>
        <Link
          to={`/offers/${offer._id}`}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default OfferCard;
