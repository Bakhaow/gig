import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateOfferMutation } from "../../redux/api/offersApiSlice";
import { useGetAllCategoriesQuery } from "../../redux/api/categoriesApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import validator from "validator";

function OfferCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetNegotiable, setBudgetNegotiable] = useState(false);
  const [category, setCategory] = useState("");
  const [deadlineEnabled, setDeadlineEnabled] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [restrictedToAdvancedProviders, setRestrictedToAdvancedProviders] =
    useState(false);

  const [createOffer] = useCreateOfferMutation();
  const { data: responseData } = useGetAllCategoriesQuery();
  const categories = responseData?.data || [];

  const navigate = useNavigate();

  // Function to sanitize the input value
  const sanitizeInput = (input) => {
    return validator.escape(input.trim());
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);
    const sanitizedBudget = validator.isNumeric(budget.toString())
      ? parseFloat(budget)
      : 0;
    const sanitizedCategory = sanitizeInput(category);

    if (
      !sanitizedTitle ||
      !sanitizedDescription ||
      !sanitizedBudget ||
      !sanitizedCategory
    ) {
      toast.error("Please add all fields");
      return;
    }

    try {
      const offerData = {
        title: sanitizedTitle,
        description: sanitizedDescription,
        budget: sanitizedBudget,
        budgetNegotiable,
        category: sanitizedCategory,
        deadline: deadlineEnabled ? deadline : null,
        restrictedToAdvancedProviders,
      };

      const { data: responseData } = await createOffer(offerData);

      const res = responseData.data;
      if (res.error) {
        toast.error("Offer creation failed. Try Again.");
      } else {
        toast.success(`${res.title} is created`);
        navigate("/admin/offers");
      }
    } catch (error) {
      console.error(error);
      toast.error("Offer creation failed. Try Again.");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12">Create Offer</div>

          <div className="p-3">
            <div className="flex justify-between">
              <div className="one">
                <label htmlFor="title">Title</label> <br />
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101010] text-white"
                />
              </div>
              <div className="two">
                <label htmlFor="budget">Budget</label> <br />
                <input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101010] text-white"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div className="one">
                <label htmlFor="category">Category</label> <br />
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101010] text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="two">
                <input
                  id="deadline"
                  type="checkbox"
                  checked={deadlineEnabled}
                  onChange={() => setDeadlineEnabled(!deadlineEnabled)}
                  className="mr-2"
                />
                <label htmlFor="deadline">Set Deadline</label>

                {deadlineEnabled && (
                  <>
                    <label htmlFor="deadline">Deadline for Completion</label>{" "}
                    <br />
                    <input
                      id="deadline"
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101010] text-white"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description">Description</label> <br />
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 mb-3 bg-[#101010] text-white border rounded-lg w-[95%]"
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                id="budgetNegotiable"
                type="checkbox"
                checked={budgetNegotiable}
                onChange={() => setBudgetNegotiable(!budgetNegotiable)}
                className="mr-2"
              />
              <label htmlFor="budgetNegotiable">Is Budget Negotiable?</label>
            </div>

            <div className="flex items-center">
              <input
                id="restrict"
                type="checkbox"
                checked={restrictedToAdvancedProviders}
                onChange={() =>
                  setRestrictedToAdvancedProviders(
                    !restrictedToAdvancedProviders
                  )
                }
                className="mr-2"
              />
              <label htmlFor="restrict">Restrict to Advanced Providers</label>
            </div>

            <button
              onClick={submitHandler}
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-yellow-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferCreate;
