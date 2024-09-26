import React, { useEffect, useState } from "react";
import './installPWA.css';
import { Dialog , DialogContent, DialogTitle, DialogActions} from "@mui/material";
const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);
    const [open, setOpen] = useState(sessionStorage.getItem('isFirstVist') == 'false' ? false : true);
  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      console.log("we are being triggered :D");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = evt => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  const onClose = () => {
    setOpen(false);
    sessionStorage.setItem('isFirstVist', false)
  }
  if (!supportsPWA) {
    return null;
  }
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle className="pwa-text">Install Mediasea App</DialogTitle>
        <DialogContent className="pwa-text">
            <p>Install Mediasea App on your home screen for quick and easy access when you're on the go.</p>
        </DialogContent>
        <DialogActions>
            <button className="pwa-cancel" onClick={onClose}>Cancel</button>
            <button className="pwa-accept" onClick={onClick}>Install</button>
        </DialogActions>
    </Dialog>
    // <button
    //   className="link-button"
    //   id="setup_button"
    //   aria-label="Install app"
    //   title="Install app"
    //   onClick={onClick}
    // >
    //   Install
    // </button>
  );
};

export default InstallPWA;