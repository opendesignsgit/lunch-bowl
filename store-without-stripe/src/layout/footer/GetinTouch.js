import React, { useState,useEffect  } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, Box, Typography, TextField, Button } from "@mui/material";
import LogIn from "../../../public/LogInSignUp/LogIn.jpg";

const GetinTouch = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
  });
   // Reset form when dialog opens
   useEffect(() => {
    if (open) {
      setFormData({
        fullName: '',
        email: '',
        password: '',
      });
      setErrors({
        fullName: '',
        email: '',
        password: '',
      });
    }
  }, [open]);
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    } else {
      newErrors.fullName = '';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    } else {
      newErrors.email = '';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth className="gintpopus compopups" sx={{
        '& .MuiDialog-paper': {
          height: 'auto',
        } }}>
        <IconButton className="popClose" onClick={onClose} sx={{ position: "absolute", top: 16, right: 16, zIndex: 99, }} > <CloseIcon />  </IconButton>
        <Box className='gintPopBox gintPopRow Box flex bg-white relative h-full'>
          <Box className='w-[50%] gintPopCol gintLCol' sx={{ backgroundImage: `url(${LogIn.src})`, backgroundSize: "cover", backgroundPosition: "center", }}></Box>
          <Box className='w-[50%] gintPopCol gintRCol self-center logboxcol p-[3vw]'>
            <div className='gintPinRow'>
            <Box sx={{ textAlign: "left", marginBottom: "24px" }} className="poptitles">
              <Typography variant="h4" color="#000" sx={{ textTransform: "uppercase", marginBottom: "4px" }} > Enquire Now  </Typography>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </p>
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="fullName"
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                margin="normal"
                variant="outlined"
                placeholder="Joe Bloggs" className="fieldbox"
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                variant="outlined"
                placeholder="example@domain.com" className="fieldbox"
              />
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                variant="outlined" className="fieldbox"
              />
              <Button
  color="primary"
  variant="contained"
  fullWidth
  type="submit"
  sx={{ 
    mt: 3,
    backgroundColor: '#ff6514',
    '&:hover': {
      backgroundColor: '#e55c12', // Slightly darker on hover
    }
  }}
>
  Sign Up
</Button>
            </form>
            </div>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default GetinTouch;