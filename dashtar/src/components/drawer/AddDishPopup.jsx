import React, { useState } from "react";
import Popup from "./Popup";
import ProductServices from "@/services/ProductServices";


const initialState = {
  primaryDishTitle: "",
  subDishTitle: "",
  shortDescription: "",
  description: "",
  cuisine: "",
  image: "",
  status: "active",
};

const AddDishPopup = ({ isOpen, onClose, onSuccess, addDish }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Styling classes
  const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white";
  const textareaClasses = `${inputClasses} min-h-[100px]`;
  const buttonClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    console.log('====================================');
    console.log('form', form);
    console.log('====================================');
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await await ProductServices.addDish(form);
      setLoading(false);
      setForm(initialState);
      onSuccess?.();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Error adding dish");
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Add New Dish">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="primaryDishTitle" className={labelClasses}>
            Primary Dish Title
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
            required
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className={labelClasses}>
            Short Description
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
            Full Description
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

        <div>
          <label htmlFor="cuisine" className={labelClasses}>
            Cuisine Type
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
          <label htmlFor="image" className={labelClasses}>
            Image URL
          </label>
          <input
            id="image"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={inputClasses}
            type="url"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className={labelClasses}>
            Status
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

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            className={`${buttonClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700`}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${buttonClasses} bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
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