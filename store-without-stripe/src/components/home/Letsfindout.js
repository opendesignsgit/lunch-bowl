import React from "react";
import { useState } from "react";
import SchoolServiceForm from "@components/home/SchoolServiceForm";
import SignUpPopup from "@components/logInSignUp/SignUpPopup";

const Letsfindout = () => {
  const [schoolName, setSchoolName] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Hardcoded Chennai schools data
  const schools = [
    { _id: "1", name: "Chennai Public School", location: "Anna Nagar, 600040" },
    {
      _id: "2",
      name: "PS Senior Secondary School",
      location: "Mylapore, 600004",
    },
    {
      _id: "3",
      name: "DAV Boys Senior Secondary School",
      location: "Gopalapuram, 600086",
    },
    {
      _id: "4",
      name: "Padma Seshadri Bala Bhavan",
      location: "KK Nagar, 600078",
    },
    { _id: "5", name: "Chettinad Vidyashram", location: "RA Puram, 600028" },
    { _id: "6", name: "Bala Vidya Mandir", location: "Adyar, 600020" },
    {
      _id: "7",
      name: "SBOA School & Junior College",
      location: "Anna Nagar, 600040",
    },
    {
      _id: "8",
      name: "Vidya Mandir Senior Secondary School",
      location: "Mylapore, 600004",
    },
  ];

  const handleInputChange = (e) => {
    setSchoolName(e.target.value);
  };

  const handleSchoolSelect = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleSelectSubmit = (e) => {
    e.preventDefault();
    if (selectedSchool) {
      console.log("Selected school:", selectedSchool);
      setShowSignUp(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted school name:", schoolName);
    setShowSchoolForm(true);
  };

  const renderSchoolOptions = () => {
    return schools.map((school) => (
      <option key={school._id} value={school.name}>
        {school.name} - {school.location}
      </option>
    ));
  };

  return (
    <>
      <div className="lfooutfild">
        <h6>Select a school to check its availability.</h6>
        <div className="inputbox bg-white p-[10px] rounded-[10px] flex ">
          <select
            name="schoolname"
            value={selectedSchool}
            onChange={handleSchoolSelect}
          >
            <option value="">Select School Name</option>
            {renderSchoolOptions()}
          </select>
          <button
            className="btn"
            onClick={handleSelectSubmit}
            disabled={!selectedSchool}
          >
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
      <SignUpPopup open={showSignUp} onClose={() => setShowSignUp(false)} />
    </>
  );
};

export default Letsfindout;