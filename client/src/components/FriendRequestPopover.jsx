import { useState } from "react";
import { Popover, Box, Typography, Avatar, IconButton, Divider } from "@mui/material";
import { Check, Close } from "@mui/icons-material";

export default function FriendRequestPopover({
    open,
    anchorEl,
    onClose,
    requests = [],
    onAccept,
    onReject,
}){
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            PaperProps={{ sx: { width: 300, maxWidth: "90vw", p: 1 } }}
    >
        <Typography variant="subtitle1" sx={{ px: 1, fontWeight: 600 }}>
            Friend Requests
        </Typography>
        <Divider sx={{ my: 1 }} />
        {requests.length === 0 ? (
            <Typography sx={{ px: 1 }}>No new requests</Typography>
        ) : (
            requests.map((req) => (
            <Box key={req.id || req._id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                    <Avatar src={req.picture || req.picturePath || req.avatar || req.senderPic} sx={{ mr: 1 }} />
                    <Typography noWrap sx={{ minWidth: 0 }} style={{color: 'black'}}>{req.senderName}</Typography>
                </Box>
                <Box>
                    <IconButton size="small" color="success" onClick={() => onAccept(req._id || req.id)}><Check fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => onReject(req._id || req.id)}><Close fontSize="small" /></IconButton>
                </Box>
            </Box>
            ))
        )}
    </Popover>
    )
}