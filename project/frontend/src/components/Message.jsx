import DOMPurify from "dompurify";

// eslint-disable-next-line react/prop-types
function Message({ variant, children }) {
  // Sanitize the children content
  const sanitizedChildren = DOMPurify.sanitize(children);

  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div
      className={`p-4 rounded-md ${getVariantClass()}`}
      dangerouslySetInnerHTML={{ __html: sanitizedChildren }}
    ></div>
  );
}

export default Message;
