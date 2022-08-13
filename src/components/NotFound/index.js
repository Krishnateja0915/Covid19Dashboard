import './index.css'

const NotFound = props => {
  const {history} = props

  const onClickHomeButton = () => {
    history.replace('/')
  }

  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660148262/Group_7484_vdyaxl.png"
        alt="not-found-pic"
        className="not-found-page-image"
      />
      <h1 className="not-found-page-heading">PAGE NOT FOUND</h1>
      <p className="not-found-page-description">
        we are sorry, the page you requested could not be found. Please go back
        to the homepage
      </p>
      <button type="button" className="home-button" onClick={onClickHomeButton}>
        Home
      </button>
    </div>
  )
}

export default NotFound
