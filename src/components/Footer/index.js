import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer">
    <h1 className="footer-website-logo">
      COVID19<span className="india-text">INDIA</span>
    </h1>
    <p className="footer-description">
      we stand with everyone fighting on the front lines
    </p>
    <div className="icons-container">
      <VscGithubAlt />
      <FiInstagram />
      <FaTwitter />
    </div>
  </div>
)

export default Footer
