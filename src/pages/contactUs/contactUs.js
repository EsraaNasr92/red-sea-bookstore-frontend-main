import React, { useState } from 'react';
import './contactUs.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import SideBar from '../../components/sideBar';
import * as userServices from "../../services/user.services";
import BottomNav from "../../components/bottom-nav";
const ContactUs = () => {

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [screenShot, setScreenShot] = useState('');
    const [name, setName] = useState('');
    const [messageSent, setMessageSent] = useState(false)

  const handleFileUpload = async (e) => {
    const file = await userServices.uploadFile(localStorage.getItem('id'), e.target.files[0])
    setScreenShot(file.data)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic here to send the form data to the server or an email service.
    const data ={
        email: localStorage.getItem('email') || email,
        phone: phone,
        title: title,
        message: message,
        screenShot: screenShot,
        name: localStorage.getItem('name') || name
    }
    userServices.submitContactForm(data).then((res) => {
        console.log(res)
        setEmail('');
        setPhone('');
        setTitle('');
        setMessage('');
        setScreenShot('');
        setName('');
        const supportMailData = {
            message: 'New support ticket is submitted from ' + data.name + ', you can check it here ' + `https://admin.mediasea.net/support/${res.data._id}`,
            email: localStorage.getItem('email') || email,
            subject: 'New support email from ' + data.name
        }
        userServices.sendSupportEmail(supportMailData).then((res) => {
            console.log(res)
            setMessageSent(true)
        }
        ).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
    })
    // Reset the form after submission
  };

  return (
    <>
    <Header/>
    <div className="contact-us-form-container">
    <SideBar />
    <div className="contact-us-container">

      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>

      <label htmlFor="name" className='form-label'>Your Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          disabled={localStorage.getItem('isAuthenticated')}
          value={localStorage.getItem('isAuthenticated') ? localStorage.getItem('name') : name}
          onChange={(e) => {setName(e.target.value)}}
          className='form-input'
          required/>

      <label htmlFor="phone" className='form-label'>Phone:</label>
        <input
          type="number"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => {setPhone(e.target.value)}}
          required
          className='form-input'
        />

        <label htmlFor="email" className='form-label'>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          disabled={localStorage.getItem('isAuthenticated')}
          value={localStorage.getItem('isAuthenticated') ? localStorage.getItem('email') : email}
          onChange={(e) => {setEmail(e.target.value)}}
          className='form-input'
          required/>

        <label htmlFor="title" className='form-label'>Message Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          className='form-input'
          onChange={(e) => {setTitle(e.target.value)}}
          required
        />

        <label htmlFor="message" className='form-label'>Your Message:</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={message}
          className='form-input'
          onChange={(e) => {setMessage(e.target.value)}}
          required
        ></textarea>

        <label htmlFor="screenshot" className='form-label'>Screenshot:</label>
        <input
          type="file"
          id="screenshot"
          name="screenshot"
          onChange={(e)=>handleFileUpload(e)}
          className='form-input'
          />



        {messageSent && <p className='success-ticket'>Your ticket has been submited</p>}
        <button type="submit" className='contact-submit'>Submit</button>
      </form>
    </div>
    </div>
    <Footer />
    <BottomNav />
    </>

  );
};

export default ContactUs;
