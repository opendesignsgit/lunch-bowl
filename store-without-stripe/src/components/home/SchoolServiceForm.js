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

const SchoolServiceForm = ({ prefillSchool, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    schoolName: prefillSchool || '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        {/* Left Side - Blue Section */}
        <Box
          sx={{
            width: '40%',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'white',
            fontSize: '1.8rem'
          }}>
            READY TO SERVE YOUR SCHOOL!
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
            We're excited to partner with your educational institution to provide the best services.
          </Typography>
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
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: '600', 
                    mb: 1,
                    color: '#f97316' // Orange-500
                  }}>
                    FIRST NAME*
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&:hover fieldset': {
                          borderColor: '#94a3b8',
                        },
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: '600', 
                    mb: 1,
                    color: '#f97316' // Orange-500
                  }}>
                    LAST NAME*
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&:hover fieldset': {
                          borderColor: '#94a3b8',
                        },
                      }
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: '600', 
                  mb: 1,
                  color: '#f97316' // Orange-500
                }}>
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
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#94a3b8',
                      },
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: '600', 
                  mb: 1,
                  color: '#f97316' // Orange-500
                }}>
                  SCHOOL NAME*
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#94a3b8',
                      },
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ 
                  mb: 1,
                  color: '#64748b'
                }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#94a3b8',
                      },
                    }
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  backgroundColor: '#f97316', // Orange-500
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#ea580c', // Orange-600
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