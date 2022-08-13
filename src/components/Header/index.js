import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {RiCloseCircleFill} from 'react-icons/ri'
import './index.css'

class Header extends Component {
  state = {isDisplay: false}

  showMenu = () => {
    this.setState(prevState => ({isDisplay: !prevState.isDisplay}))
  }

  hideMenu = () => {
    this.setState({isDisplay: false})
  }

  onClickHome = () => {
    Cookies.set('active_link', 'home')
  }

  onClickAbout = () => {
    Cookies.set('active_link', 'about')
  }

  render() {
    const {isDisplay} = this.state
    const activeLink = Cookies.get('active_link')
    const activeHomeClassName = activeLink === 'home' ? 'active-link' : ''
    const activeAboutClassName = activeLink === 'about' ? 'active-link' : ''
    return (
      <>
        <nav className="header">
          <ul className="nav-list">
            <li className="website-logo">
              <Link to="/" className="website-logo-nav-link">
                <p>
                  COVID19<span className="india-text">INDIA</span>
                </p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="home-nav-link">
                <button
                  type="button"
                  className={`nav-button ${activeHomeClassName}`}
                  onClick={this.onClickHome}
                >
                  Home
                </button>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className={activeAboutClassName}
                onClick={this.onClickAbout}
              >
                <button
                  type="button"
                  className={`nav-button ${activeAboutClassName}`}
                  onClick={this.onClickAbout}
                >
                  About
                </button>
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={this.showMenu}
                className="menu-button"
              >
                <img
                  src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660292907/add-to-queue_1_szwoj7.png"
                  alt="menu"
                />
              </button>
            </li>
          </ul>
        </nav>
        {isDisplay && (
          <ul className="menu">
            <li className="nav-list-sm">
              <Link to="/" className="nav-link-sm">
                <button
                  type="button"
                  className="nav-button"
                  onClick={this.hideMenu}
                >
                  Home
                </button>
              </Link>
            </li>
            <li className="nav-list-sm">
              <Link to="/about" className="nav-link-sm">
                <button
                  type="button"
                  className="nav-button"
                  onClick={this.hideMenu}
                >
                  About
                </button>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="close-button"
                onClick={this.hideMenu}
              >
                <RiCloseCircleFill />
              </button>
            </li>
          </ul>
        )}
      </>
    )
  }
}

export default Header
