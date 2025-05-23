import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import ProductServices from "@/services/ProductServices";

const initialState = {
  primaryDishTitle: "",
  subDishTitle: "",
  shortDescription: "",
  description: "",
  cuisine: "",
  image: null, // Change from empty string to null
  status: "active",
};

const AddDishPopup = ({
  isOpen,
  onClose,
  onSuccess,
  addProduct,
  productData,
  isEditing,
}) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Styling classes
  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white";
  const textareaClasses = `${inputClasses} min-h-[100px]`;
  const buttonClasses =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const labelClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const imagePreviewClasses =
    "mt-2 w-full h-48 object-cover rounded-md border border-gray-300 dark:border-gray-600";

  // In your useEffect when productData is present
  useEffect(() => {
    if (productData) {
      setForm({
        primaryDishTitle: productData.primaryDishTitle || "",
        subDishTitle: productData.subDishTitle || "",
        shortDescription: productData.shortDescription || "",
        description: productData.description || "",
        cuisine: productData.cuisine || "",
        image: productData.image || null,
        status: productData.status || "active",
      });

      // Set image preview
      if (productData.image) {
        setImagePreview(
          productData.image.startsWith("http")
            ? productData.image
            : `http://localhost:5055${productData.image}`
        );
      }
    } else {
      setForm(initialState);
      setImagePreview("");
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show preview
      setForm((prev) => ({ ...prev, image: file })); // Store file object
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // Append all form fields
      formData.append("primaryDishTitle", form.primaryDishTitle);
      formData.append("subDishTitle", form.subDishTitle);
      formData.append("shortDescription", form.shortDescription);
      formData.append("description", form.description);
      formData.append("cuisine", form.cuisine);
      formData.append("status", form.status);

      // Only append image if it's a new file
      if (form.image instanceof File) {
        formData.append("image", form.image);
      } else if (isEditing && typeof form.image === "string") {
        // For editing without changing image
        formData.append("existingImage", form.image);
      }

      let response;
      if (isEditing) {
        response = await ProductServices.updateDish(productData._id, formData);
      } else {
        response = await ProductServices.addDish(formData);
      }

      // Handle success
      onSuccess?.(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Error processing dish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Dish" : "Add New Dish"}
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="primaryDishTitle" className={labelClasses}>
              Primary Dish Title *
            </label>
            <input
              id="primaryDishTitle"
              name="primaryDishTitle"
              value={form.primaryDishTitle}
              onChange={handleChange}
              placeholder="e.g., Spaghetti Carbonara"
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="subDishTitle" className={labelClasses}>
              Sub Dish Title
            </label>
            <input
              id="subDishTitle"
              name="subDishTitle"
              value={form.subDishTitle}
              onChange={handleChange}
              placeholder="e.g., With Extra Cheese"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="shortDescription" className={labelClasses}>
            Short Description *
          </label>
          <input
            id="shortDescription"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="Brief description (max 50 characters)"
            className={inputClasses}
            maxLength={50}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClasses}>
            Full Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed description of the dish..."
            className={textareaClasses}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cuisine" className={labelClasses}>
              Cuisine Type *
            </label>
            <input
              id="cuisine"
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              placeholder="e.g., Italian, Mexican, etc."
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClasses}>
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClasses}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="image" className={labelClasses}>
            {imagePreview ? "Change Image" : "Upload Image *"}
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-md file:border-0
    file:text-sm file:font-semibold
    file:bg-emerald-50 file:text-emerald-700
    hover:file:bg-emerald-100"
          />

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className={imagePreviewClasses}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            className={`${buttonClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700`}
            onClick={() => {
              onClose();
              setForm(initialState);
              setImagePreview("");
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${buttonClasses} bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center min-w-[120px]`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : isEditing ? (
              "Update Dish"
            ) : (
              "Add Dish"
            )}
          </button>
        </div>
      </form>
    </Popup>
  );
};

export default AddDishPopup;
