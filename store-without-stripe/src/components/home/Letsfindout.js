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
            <option value="Asan Memorial Senior Secondary School">Asan Memorial Senior Secondary School</option>
            <option value="D.A.V. Public School">D.A.V. Public School</option>
            <option value="Don Bosco Matriculation Higher Secondary School">Don Bosco Matriculation Higher Secondary School</option>
            <option value="Holy Angels Anglo Indian Higher Secondary School">Holy Angels Anglo Indian Higher Secondary School</option>
            <option value="KC High School">KC High School</option>
            <option value="MCTM International School">MCTM International School</option>
            <option value="P.S. Higher Secondary School">P.S. Higher Secondary School</option>
            <option value="Padma Seshadri Bala Bhavan School">Padma Seshadri Bala Bhavan School</option>
            <option value="Sishya School">Sishya School</option>
            <option value="St. Patrick's Anglo Indian Higher Secondary School">St. Patrick's Anglo Indian Higher Secondary School</option>
            <option value="Vidya Mandir Senior Secondary School, Mylapore">Vidya Mandir Senior Secondary School, Mylapore</option>
            <option value="Bala Vidya Mandir">Bala Vidya Mandir</option>
            <option value="Sharanalaya Montessori School">Sharanalaya Montessori School</option>
            <option value="Chetinad Harishree Vidyalayam">Chetinad Harishree Vidyalayam</option>
            <option value="Vidyodaya School">Vidyodaya School</option>
            <option value="Sprouts">Sprouts</option>
            <option value="St Michael Academy">St Michael Academy</option>
            <option value="Accord International School">Accord International School</option>
            <option value="St Johns English School">St Johns English School</option>
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
