import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import ProductServices from "@/services/ProductServices";

const initialState = {
  primaryDishTitle: "",
  subDishTitle: "",
  shortDescription: "",
  description: "",
  cuisine: "",
  image: null,
  status: "active",
  nutrition: {
    calories: "",
    fats: "",
    carbs: "",
    vitamins: "",
    proteins: "",
    minerals: "",
  },
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
  const [nutritionErrors, setNutritionErrors] = useState({
    calories: false,
    fats: false,
    carbs: false,
    vitamins: false,
    proteins: false,
    minerals: false,
  });

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

  const NutritionInput = ({ name, label, unit, value, onChange, error }) => (
    <div>
      <label htmlFor={name} className={labelClasses}>
        {label} {unit && `(${unit})`}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        min="0"
        max="5"
        step="0.1" // Allows decimal values if needed
        value={value === 0 ? "" : value}
        onChange={onChange}
        className={`${inputClasses} ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">Value must be 5 or less</p>
      )}
    </div>
  );

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
        nutrition: productData.nutrition
          ? {
              calories: productData.nutrition.calories || "",
              fats: productData.nutrition.fats || "",
              carbs: productData.nutrition.carbs || "",
              vitamins: productData.nutrition.vitamins || "",
              proteins: productData.nutrition.proteins || "",
              minerals: productData.nutrition.minerals || "",
            }
          : {
              calories: "",
              fats: "",
              carbs: "",
              vitamins: "",
              proteins: "",
              minerals: "",
            },
      });

      // Improved image preview handling
      if (productData.image) {
        // Check if it's already a full URL or needs to be constructed
        const imageUrl = productData.image.startsWith("http")
          ? productData.image
          : productData.image.startsWith("/")
          ? `http://localhost:5055${productData.image}`
          : productData.image;
        console.log("---------->", imageUrl);

        setImagePreview(imageUrl);
      } else {
        setImagePreview("");
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
      // Create preview URL and store it
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setForm((prev) => ({ ...prev, image: file }));

      // Clean up the object URL when component unmounts or when image changes
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : Number(value);

    // Validate
    const isValid = numericValue === "" || numericValue <= 5;

    setNutritionErrors((prev) => ({
      ...prev,
      [name]: !isValid,
    }));

    // Only update if valid or empty
    if (isValid) {
      setForm((prev) => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          [name]: numericValue === "" ? "" : numericValue,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for any nutrition errors
    const hasErrors = Object.values(nutritionErrors).some(Boolean);
    if (hasErrors) {
      setError("Please correct the nutrition values (must be 5 or less)");
      return;
    }

    // Check if any nutrition value exceeds 5
    const exceedsLimit = Object.values(form.nutrition).some(
      (val) => val !== "" && Number(val) > 5
    );

    if (exceedsLimit) {
      setError("Nutrition values must be 5 or less");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      const nutritionData = {
        calories:
          form.nutrition.calories === "" ? 0 : Number(form.nutrition.calories),
        fats: form.nutrition.fats === "" ? 0 : Number(form.nutrition.fats),
        carbs: form.nutrition.carbs === "" ? 0 : Number(form.nutrition.carbs),
        vitamins:
          form.nutrition.vitamins === "" ? 0 : Number(form.nutrition.vitamins),
        proteins:
          form.nutrition.proteins === "" ? 0 : Number(form.nutrition.proteins),
        minerals:
          form.nutrition.minerals === "" ? 0 : Number(form.nutrition.minerals),
      };

      // Append all form fields
      formData.append("primaryDishTitle", form.primaryDishTitle);
      formData.append("subDishTitle", form.subDishTitle);
      formData.append("shortDescription", form.shortDescription);
      formData.append("description", form.description);
      formData.append("cuisine", form.cuisine);
      formData.append("status", form.status);

      // Append nutrition data
      formData.append("nutrition[calories]", nutritionData.calories);
      formData.append("nutrition[fats]", nutritionData.fats);
      formData.append("nutrition[carbs]", nutritionData.carbs);
      formData.append("nutrition[vitamins]", nutritionData.vitamins);
      formData.append("nutrition[proteins]", nutritionData.proteins);
      formData.append("nutrition[minerals]", nutritionData.minerals);

      // Image handling
      if (form.image instanceof File) {
        formData.append("image", form.image);
      } else if (isEditing && form.image) {
        // For editing without changing image
        formData.append("existingImage", form.image);
      }

      let response;
      if (isEditing) {
        response = await ProductServices.updateDish(productData._id, formData);
      } else {
        response = await ProductServices.addDish(formData);
      }

     // Call onSuccess with both the response data and success status
    onSuccess?.(response.data, true); // true indicates success
    onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Error processing dish");
      // Call onSuccess with false to indicate failure
    onSuccess?.(null, false);
      console.error("Error:", err);
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
            Dish Image {!isEditing && "*"}
          </label>

          {/* Improved image upload box */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 ${
              !imagePreview
                ? "border-gray-300 dark:border-gray-600"
                : "border-emerald-500"
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className={`${imagePreviewClasses} mb-3`}
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                  >
                    Change Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <label
                    htmlFor="image"
                    className="cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800 px-4 py-2 rounded-md font-medium"
                  >
                    Select Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={!isEditing} // Only required for new dishes
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG, or GIF (Max 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NutritionInput
            name="calories"
            label="Calories"
            value={form.nutrition.calories}
            onChange={handleNutritionChange}
            error={nutritionErrors.calories}
          />
          <NutritionInput
            name="fats"
            label="Fats"
            unit="g"
            value={form.nutrition.fats}
            onChange={handleNutritionChange}
            error={nutritionErrors.fats}
          />
          <NutritionInput
            name="carbs"
            label="Carbs"
            unit="g"
            value={form.nutrition.carbs}
            onChange={handleNutritionChange}
            error={nutritionErrors.carbs}
          />
          <NutritionInput
            name="vitamins"
            label="Vitamins"
            unit="mg"
            value={form.nutrition.vitamins}
            onChange={handleNutritionChange}
            error={nutritionErrors.vitamins}
          />
          <NutritionInput
            name="proteins"
            label="Proteins"
            unit="g"
            value={form.nutrition.proteins}
            onChange={handleNutritionChange}
            error={nutritionErrors.proteins}
          />
          <NutritionInput
            name="minerals"
            label="Minerals"
            unit="mg"
            value={form.nutrition.minerals}
            onChange={handleNutritionChange}
            error={nutritionErrors.minerals}
          />
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
