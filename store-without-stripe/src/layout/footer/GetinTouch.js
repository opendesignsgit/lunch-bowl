import React from 'react'
import Image from 'next/image';
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, Box, Typography } from "@mui/material";
import LogIn from "../../../public/LogInSignUp/LogIn.jpg";

const GetinTouch = ({ open, onClose }) => {
  return (
    <div>
         <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth  className="gintpopus compopups" sx={{
    '& .MuiDialog-paper': {
      height: '75vh',
    } }}>
            <IconButton className="popClose" onClick={onClose} sx={{ position: "absolute", top: 16, right: 16, zIndex: 99, }} > <CloseIcon />  </IconButton>
            <Box className='gintPopBox Box flex bg-white relative h-full'>
              <Box className='w-[50%]' sx={{ backgroundImage: `url(${LogIn.src})`, backgroundSize: "cover", backgroundPosition: "center", }}></Box>
              <Box className='w-[50%] self-center logboxcol p-[3vw]'>
                  <Box sx={{ textAlign: "left", marginBottom: "24px" }} className="poptitles">
                      <Typography variant="h4" color="#000"  sx={{ textTransform: "uppercase", marginBottom: "4px" }} > Enquire Now  </Typography>
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </p>
                  </Box>
                <form method="post" action="/" id="form" class="validate">
                  <div class="form-field">
                    <label for="full-name">Full Name</label>
                    <input type="text" name="full-name" id="full-name" placeholder="Joe Bloggs" required />
                  </div>
                  <div class="form-field">
                    <label for="email-input">Email</label>
                    <input type="email" name="email-input" id="email-input" placeholder="example@domain.com" required />
                  </div>
                  <div class="form-field">
                    <label for="password-input">Password</label>
                    <input type="password" name="password-input" id="password-input" required />
                  </div>
                  <div class="form-field">
                    <label for=""></label>
                    <input type="submit" value="Sign Up" />
                  </div>
                </form>
              </Box>
            </Box>
        </Dialog>

    </div>
  )
}

export default GetinTouch