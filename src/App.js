import './App.css';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import Home from './pages/home/home';
import UserBooks from './pages/userBooks/userBooks';
import BookDetails from './pages/bookDetails/bookDetails';
import UserProfile from './pages/userProfile/userProfile';
import ContactUs from './pages/contactUs/contactUs';
import Catalouge from './pages/catalouge/catalouge';
import ResetPasswordRequest from './pages/resetPasswordRequest/resetPasswordRequest';
import ResetPassword from './pages/resetPassword/resetPassword';
import DigitalBook from './pages/digitalBook/digitalbook';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import InstallPWA from "../src/components/installPWA";
function App() {
  return (
    <BrowserRouter>
      <Switch>


        {/* <Route path="/about" component={AboutMe} exact/> */}
        <Route path="/" component={Home} exact/>
        {localStorage.getItem('isAuthenticated') ? <Route path="/login" component={Home} exact/> : <Route path="/login" component={Login} exact/>}
        {localStorage.getItem('isAuthenticated') ? <Route path="/signup" component={Home} exact/> : <Route path="/signup" component={Signup} exact/>}
        {localStorage.getItem('isAuthenticated') ? <Route path="/bookDetails/:bookId" component={BookDetails} exact/> : <Route path="/bookDetails/:bookId" component={Login} exact/>}
        {localStorage.getItem('isAuthenticated') ? <Route path="/userBooks" component={UserBooks} exact/> : <Route path="/userBooks" component={Login} exact/>}
        {localStorage.getItem('isAuthenticated') ? <Route path="/userProfile" component={UserProfile} exact/> : <Route path="/userProfile" component={Login} exact/>}
        {localStorage.getItem('isAuthenticated') ? <Route path="/resetPasswordRequest" component={Home} exact/> : <Route path="/resetPasswordRequest" component={ResetPasswordRequest} exact/>}
        {localStorage.getItem('isAuthenticated') ? <Route path="/resetPassword" component={Home} exact/> : <Route path="/resetPassword/:token" component={ResetPassword} exact/>}
        <Route path="/contactUs" component={ContactUs} exact/>
        <Route path="/catalouge" component={Catalouge} exact/>
        <Route path="/digitalBook/:bookId" component={DigitalBook} exact/>
      </Switch>
      <InstallPWA />
    </BrowserRouter>
  );
}


export default App;
