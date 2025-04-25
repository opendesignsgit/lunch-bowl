import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import addSchoolPopUp from "../../../public/home/addSchoolPopUp.png";

const SchoolServiceForm = ({ prefillSchool, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    schoolName: prefillSchool || '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Left Side - Image Section */}
        <Box
          sx={{
            width: '40%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            overflow: 'hidden'
          }}
        >
          <img 
            src={addSchoolPopUp} 
            alt="School Service Illustration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* Right Side - Form */}
        <Box sx={{ width: '60%', p: 4 }}>
          <DialogTitle sx={{ 
            fontWeight: 'bold',
            fontSize: '1.5rem',
            px: 0,
            pt: 0,
            color: '#1e293b'
          }}>
            School Service Request
          </DialogTitle>
          
          <DialogContent sx={{ px: 0 }}>
            <form onSubmit={handleSubmit}>
              {/* FIRST NAME & LAST NAME */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: '600',
                      mb: 1,
                      color: '#f97316'
                    }}
                  >
                    FIRST NAME*
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: '600',
                      mb: 1,
                      color: '#f97316'
                    }}
                  >
                    LAST NAME*
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Box>
              </Box>

              {/* MOBILE NUMBER */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: '600',
                    mb: 1,
                    color: '#f97316'
                  }}
                >
                  MOBILE NUMBER*
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                />
              </Box>

              {/* SCHOOL NAME */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: '600',
                    mb: 1,
                    color: '#f97316'
                  }}
                >
                  SCHOOL NAME*
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  error={!!errors.schoolName}
                  helperText={errors.schoolName}
                />
              </Box>

              {/* MESSAGE */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: '#64748b'
                  }}
                >
                  MESSAGE
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Box>

              {/* SUBMIT */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  backgroundColor: '#f97316',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#ea580c'
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: 'none'
                }}
              >
                Submit Request
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SchoolServiceForm;
