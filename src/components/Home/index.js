import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import {BiChevronRightSquare} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class Home extends Component {
  state = {
    searchInput: '',
    statsList: [],
    isLoading: true,
  }

  componentDidMount() {
    this.getCountryWideCovid19Cases()
  }

  convertObjectsDataIntoListItemsUsingForInMethod = data => {
    const {statesList} = this.props

    const resultList = []
    const keyNames = Object.keys(data)

    keyNames.forEach(keyName => {
      if (data[keyName] && keyName !== 'TT') {
        const {total} = data[keyName]
        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const population = data[keyName].meta.population
          ? data[keyName].meta.population
          : 0
        const stateDetails = statesList.find(
          state => state.state_code === keyName,
        )
        if (stateDetails !== undefined) {
          resultList.push({
            stateCode: keyName,
            name: stateDetails.state_name,
            confirmed,
            deceased,
            recovered,
            tested,
            population,
            active: confirmed - (deceased + recovered),
          })
        }
      }
    })
    return resultList
  }

  getCountryWideCovid19Cases = async () => {
    const response = await fetch('https://apis.ccbp.in/covid19-state-wise-data')

    if (response.ok) {
      const data = await response.json()
      const statsList = this.convertObjectsDataIntoListItemsUsingForInMethod(
        data,
      )
      this.setState({
        statsList,
        isLoading: false,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickHomeButton = () => {
    this.getCovid19Stats()
  }

  onClickAscending = () => {
    const {statsList} = this.state
    const newStatsList = statsList.sort((a, b) => {
      const A = a.name.toLowerCase()
      const B = b.name.toLowerCase()
      if (A < B) {
        return -1
      }
      if (A > B) {
        return 1
      }
      return 0
    })
    this.setState({statsList: newStatsList})
  }

  onClickDescending = () => {
    const {statsList} = this.state
    const newStatsList = statsList.sort((a, b) => {
      const A = a.name.toLowerCase()
      const B = b.name.toLowerCase()
      if (A < B) {
        return 1
      }
      if (A > B) {
        return -1
      }
      return 0
    })
    this.setState({statsList: newStatsList})
  }

  renderStatsList = stats => {
    const {
      stateCode,
      name,
      confirmed,
      active,
      recovered,
      deceased,
      population,
    } = stats
    return (
      <li className="stats-details" key={stateCode}>
        <p className="value state-name">{name}</p>
        <p className="value confirmed">{confirmed}</p>
        <p className="value active">{active}</p>
        <p className="value recovered">{recovered}</p>
        <p className="value deceased">{deceased}</p>
        <p className="value population">{population}</p>
      </li>
    )
  }

  renderSearchDetails = searchDetails => {
    const {name, stateCode} = searchDetails
    return (
      <li key={stateCode} className="state-item">
        <Link to={`/state/${stateCode}`} className="state-link">
          <p className="search-result-name">{name}</p>
          <div className="search-result-code-container">
            <p className="search-result-code">{stateCode}</p>
            <BiChevronRightSquare />
          </div>
        </Link>
      </li>
    )
  }

  renderStatsContainer = () => {
    const {statsList} = this.state
    let confirmed = 0
    let deceased = 0
    let recovered = 0
    statsList.forEach(stat => {
      confirmed += stat.confirmed
      deceased += stat.deceased
      recovered += stat.recovered
    })
    const active = confirmed - (deceased + recovered)
    return (
      <>
        <div className="covid-details-containers">
          <div
            testid="countryWideConfirmedCases"
            className="country-wide-confirmed-cases"
          >
            <p>Confirmed</p>
            <img
              src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660062836/check-mark_1_gphcte.png"
              alt="country wide confirmed cases pic"
            />
            <p>{confirmed}</p>
          </div>
          <div
            testid="countryWideActiveCases"
            className="country-wide-active-cases"
          >
            <p>Active</p>
            <img
              src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660063054/protection_1_ogsxmk.png"
              alt="country wide active cases pic"
            />
            <p>{active.toString()}</p>
          </div>
          <div
            testid="countryWideRecoveredCases"
            className="country-wide-recovered-cases"
          >
            <p>Recovered</p>
            <img
              src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660063197/recovered_1_cvyidz.png"
              alt="country wide recovered cases pic"
            />
            <p>{recovered}</p>
          </div>
          <div
            testid="countryWideDeceasedCases"
            className="country-wide-deceased-cases"
          >
            <p>Deceased</p>
            <img
              src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660063120/breathing_1_d6lc0j.png"
              alt="country wide deceased cases pic"
            />
            <p>{deceased}</p>
          </div>
        </div>
        <div
          testid="stateWiseCovidDataTable"
          className="state-wise-covid-data-table"
        >
          <div className="stats-header">
            <div className="states-heading-sort-buttons-container">
              <p className="column-header">States/UT</p>
              <button
                testid="ascendingSort"
                type="button"
                className="sort-button ascending-sort"
                onClick={this.onClickAscending}
              >
                <FcGenericSortingAsc />
              </button>
              <button
                testid="descendingSort"
                type="button"
                className="sort-button"
                onClick={this.onClickDescending}
              >
                <FcGenericSortingDesc />
              </button>
            </div>
            <p className="column-header confirmed-header">Confirmed</p>
            <p className="column-header active-header">Active</p>
            <p className="column-header recovered-header">Recovered</p>
            <p className="column-header deceased-header">Deceased</p>
            <p className="column-header population-header">Population</p>
          </div>
          <ul className="stats-list">
            {statsList.map(eachStat => this.renderStatsList(eachStat))}
          </ul>
        </div>
        <Footer />
      </>
    )
  }

  renderSearchedResults = () => {
    const {statsList, searchInput} = this.state
    const searchedStatsList = statsList.filter(state =>
      state.name.toLowerCase().includes(searchInput.toLowerCase()),
    )
    if (searchInput !== '') {
      return (
        <ul testid="searchResultsUnorderedList" className="search-results-list">
          {searchedStatsList.map(search => this.renderSearchDetails(search))}
        </ul>
      )
    }
    return this.renderStatsContainer()
  }

  renderSuccessView = () => {
    const {searchInput} = this.setState
    return (
      <>
        <Header />
        <div className="search-input-container">
          <button type="button" className="search-button">
            <BsSearch size={12} />
          </button>
          <input
            type="search"
            placeholder="Enter the State"
            className="search-input"
            onChange={this.onChangeSearchInput}
            value={searchInput}
          />
        </div>
        {this.renderSearchedResults()}
      </>
    )
  }

  renderLoader = () => (
    <>
      <Header />
      <div testid="homeRouteLoader" className="loader">
        <Loader type="TailSpin" color="#007bff" height="50" width="50" />
      </div>
    </>
  )

  render() {
    const {isLoading} = this.state
    return (
      <div className="home-container">
        {!isLoading ? this.renderSuccessView() : this.renderLoader()}
      </div>
    )
  }
}

export default Home
