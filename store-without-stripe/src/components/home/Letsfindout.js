import React from "react";
import { useState } from "react";
import SchoolServiceForm from "@components/home/SchoolServiceForm";

const Letsfindout = () => {
  const [schoolName, setSchoolName] = useState("");
  const [showSchoolForm, setShowSchoolForm] = useState(false);

  const handleInputChange = (e) => {
    setSchoolName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can use the schoolName state here
    console.log("Submitted school name:", schoolName);
    setShowSchoolForm(true);
    // Add your submission logic here
  };
  return (
    <>
      <div className="lfooutfild">
        <h6>Select a school to check its availability.</h6>
        <div className="inputbox bg-white p-[10px] rounded-[10px] flex ">
          <select name="schoolname">
            <option>Select School Name</option>
            <option value="OptionOne">option 1</option>
            <option value="OptionTwo">option 2</option>
            <option value="OptionThree">option 3</option>
          </select>
          <button className="btn">
            <span>Submit</span>
          </button>
        </div>
      </div>
      <div className="orfild flex items-center justify-center my-[2vh]">
        <h6>or</h6>
      </div>
      <div className="lfooutfild">
        <h6>
          Didn't find your school? Submit Request.{" "}
          <small>(Please make sure to include the Pincode.)</small>
        </h6>
        <div className="inputbox bg-white p-[10px] rounded-[10px] flex">
          <input
            name="shippingOption"
            type="text"
            value={schoolName}
            onChange={handleInputChange}
            placeholder="Enter School Name"
            className="form-radio outline-none focus:ring-0 text-emerald-500"
          />
          <button className="btn" onClick={handleSubmit}>
            <span>Submit</span>
          </button>
        </div>
      </div>
      {showSchoolForm && (
        <SchoolServiceForm
          prefillSchool={schoolName}
          onClose={() => setShowSchoolForm(false)}
        />
      )}
    </>
  );
};

export default Letsfindout;
