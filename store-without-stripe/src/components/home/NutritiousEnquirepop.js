import React from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, Box, Typography, TextField, Button } from "@mui/material";

const NutritiousEnquire = ({ open, onClose }) => {

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth className="nutripopup compopups" sx={{
        '& .MuiDialog-paper': {
          height: 'auto',
        } }}>
        <IconButton className="popClose" onClick={onClose} sx={{ position: "absolute", top: 16, right: 16, zIndex: 99, }} > <CloseIcon />  </IconButton>
        <Box className='nutriPopBox Box flex bg-white relative h-full'>
          <Box className='w-[50%]' sx={{ backgroundImage: `url(/LogInSignUp/signuppopimg.jpg)`, backgroundSize: "cover", backgroundPosition: "center", }}></Box>
          <Box className='w-[50%] self-center logboxcol p-[3vw]'>
            <Box sx={{ textAlign: "left", marginBottom: "24px" }} className="poptitles">
              <Typography variant="h4" color="#000" sx={{ textTransform: "uppercase", marginBottom: "4px" }} > Nutritious Enquire  </Typography>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
            </Box>
            <form >
              <TextField
                fullWidth
                id="fullName"
                name="fullName"
                label="Full Name"
                type="text"
                value=''
                margin="normal"
                placeholder="Joe Bloggs"
                className="fieldbox"
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value=''
                margin="normal"
                placeholder="example@domain.com"
                className="fieldbox"
              />
              <TextField
                fullWidth
                id="mobile"
                name="mobile"
                label="Mobile Number"
                type="tel"
                value=''
                margin="normal"
                placeholder="1234567890"
                className="fieldbox"
              />
              <TextField
                fullWidth
                id="message"
                name="message"
                label="Message"
                type="tel"
                value=''
                margin="normal"
                placeholder="Message"
                className="fieldbox"
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
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default NutritiousEnquire;