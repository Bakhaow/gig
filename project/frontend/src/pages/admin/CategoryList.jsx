import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useRemoveCategoryMutation,
  useGetAllCategoriesQuery,
} from "../../redux/api/categoriesApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

function CategoryList() {
  const { data: responseData, refetch } = useGetAllCategoriesQuery();
  const categories = responseData?.data || [];

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [removeCategory] = useRemoveCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success("Category successfully created");
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updateName) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      const updatedCategory = {
        ...selectedCategory,
        name: updateName,
      };

      const result = await updateCategory(updatedCategory).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Category successfully updated");
        setModalVisible(false);
        setSelectedCategory(null);
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleRemoveCategory = async () => {
    try {
      const result = await removeCategory(selectedCategory).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Category successfully deleted");
        setModalVisible(false);
        setSelectedCategory(null);
        setUpdateName("");
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row mt-[8vh]">
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <div className="h-12">Manage Categories</div>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white border border-yellow-500 text-yellow-500 py-2 px-4 rounded-lg m-3 hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                onClick={() => {
                  setSelectedCategory(category);
                  setModalVisible(true);
                  setUpdateName(category.name);
                }}
              >
                {" "}
                {category.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updateName}
            setValue={(value) => setUpdateName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleRemoveCategory}
          />
        </Modal>
      </div>
    </div>
  );
}

export default CategoryList;
