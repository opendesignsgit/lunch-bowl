import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, Box, Typography } from "@mui/material";

const HomepopVideo = ({ open, onClose }) => {
  return (
    <>
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth  className="popvideodialog" sx={{
            '& .MuiDialog-paper': {
                height: '75vh',
            } 
         }}>
            <IconButton className="popClose" onClick={onClose} sx={{ position: "absolute", top: 16, right: 16, zIndex: 99, }} > <CloseIcon />  </IconButton>
        <iframe src="https://www.youtube.com/embed/HwOdzhMsquU?si=T4bmH6qp8j0f5dCU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </Dialog>
    </>
  )
}

export default HomepopVideo