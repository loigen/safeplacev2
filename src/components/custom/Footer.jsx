import React from "react";
import "../../styles/footer.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import logo from "../../images/logo.png";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => {
  return (
    <div className="footer">
      <div className="right">
        <div className="topright">
          <div className="rightside">
            <div>
              <img src={logo} alt="" />
            </div>
            <div>
              <p>
                Embracing diversity and empathy, providing a supportive platform
                for personal growth and mental wellness.
              </p>
            </div>
          </div>
          <div className="leftside">
            <h1>Information</h1>
            <div className="info">
              <div>
                <LocationOnIcon />
              </div>
              <h2>Office</h2>
            </div>
            <div className="info">
              <div>
                <PhoneIcon />
              </div>
              <h2>0956 554 0992</h2>
            </div>
          </div>
        </div>
        <div className="subscribe">
          <div className="inputfield">
            {" "}
            <input type="text" placeholder="Example@gmail.com"/>
            <button>SUBSCRIBE</button>
          </div>
        </div>
      </div>
      <div className="left">
        <div className="title">Keep Connected</div>
        <div className="info">
          <div><LinkedInIcon/></div>
          <div>LinkedIn</div>
        </div >
        <div className="info">
          <div><InstagramIcon/></div>
          <div>Instagram</div>
        </div>
        <div className="info">
          <div><WhatsAppIcon/></div>
          <div>Whats App</div>
        </div>
        <div className="info">
          <div><FacebookIcon/></div>
          <div>Facebook</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
