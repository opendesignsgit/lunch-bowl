import React from 'react'

const Letsfindout = () => {
  return (
    <>
        <div className='lfooutfild'>
            <h6>Select a school to check its availability.</h6>
            <div className="inputbox bg-white p-[10px] rounded-[10px] flex ">
                <select  name="schoolname">
                    <option >Select School Name</option>
                    <option value="OptionOne">option 1</option>
                    <option value="OptionTwo">option 2</option>
                    <option value="OptionThree">option 3</option>
                </select>
                <button className="btn"><span >Submit</span></button>
            </div>
        </div>
        <div className='orfild flex items-center justify-center my-[2vh]'>
                <h6>or</h6>
        </div>
        <div className='lfooutfild'>
            <h6>Didn't find your school? Submit Request. <small>(Please make sure to include the Pincode.)</small></h6>
            <div className="inputbox bg-white p-[10px] rounded-[10px] flex">
                <input name="shippingOption" type="text" value='' placeholder='Enter School Name' className="form-radio outline-none focus:ring-0 text-emerald-500" />
                <button className="btn"><span >Submit</span></button>
            </div>
        </div>
    </>
  )
}

export default Letsfindout