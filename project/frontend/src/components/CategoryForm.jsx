import validator from "validator";

/* eslint-disable react/prop-types */
function CategoryForm({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) {
  // Function to sanitize the input value
  const sanitizeInput = (input) => {
    return validator.escape(input.trim());
  };

  // Handle input change with sanitization
  const handleChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setValue(sanitizedValue);
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full"
          placeholder="Write Category Name"
          value={value}
          onChange={handleChange}
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;
