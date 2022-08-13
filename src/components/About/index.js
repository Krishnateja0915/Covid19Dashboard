import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class About extends Component {
  state = {faqsList: [], isLoading: true}

  componentDidMount() {
    this.getFaqsList()
  }

  onClickAboutButton = () => {
    this.getFaqsList()
  }

  getFaqsList = async () => {
    const response = await fetch('https://apis.ccbp.in/covid19-faqs')
    if (response.ok) {
      const data = await response.json()
      this.setState({faqsList: data.faq, isLoading: false})
    }
  }

  renderFaqsList = faqDetails => {
    const {qno, question, answer} = faqDetails
    return (
      <li key={qno}>
        <p className="question">{question}</p>
        <p className="answer">{answer}</p>
      </li>
    )
  }

  renderSuccessView = () => {
    const {faqsList} = this.state
    return (
      <>
        <Header />
        <div className="about-container">
          <h1 className="about-heading">About</h1>
          <p className="about-route-last-updated">Last update on 28th 2021.</p>
          <p className="custom-text">
            COVID-19 vaccines be ready for distribution
          </p>
          <ul testid="faqsUnorderedList" className="faqs-list">
            {faqsList.map(faq => this.renderFaqsList(faq))}
          </ul>
        </div>
        <Footer />
      </>
    )
  }

  renderLoader = () => (
    <>
      <Header />
      <div testid="aboutRouteLoader" className="loader">
        <Loader type="TailSpin" color="#007bff" height="50" width="50" />
      </div>
    </>
  )

  render() {
    const {isLoading} = this.state
    return (
      <div className="about-route">
        {isLoading ? this.renderLoader() : this.renderSuccessView()}
      </div>
    )
  }
}

export default About
