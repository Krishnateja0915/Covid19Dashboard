import {Component} from 'react'
import {LineChart, XAxis, YAxis, Line, BarChart, Bar} from 'recharts'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class State extends Component {
  state = {
    stateStats: {},
    isLoading: true,
    isTimeLineLoading: true,
    activeTab: 'confirmed',
    datesList: [],
  }

  componentDidMount() {
    this.getCovid19Stats()
  }

  onClickConfirmedTab = () => {
    this.setState({activeTab: 'confirmed'})
  }

  onClickActiveTab = () => {
    this.setState({activeTab: 'active'})
  }

  onClickRecoveredTab = () => {
    this.setState({activeTab: 'recovered'})
  }

  onClickDeceasedTab = () => {
    this.setState({activeTab: 'deceased'})
  }

  convertObjectsDataIntoListItemsUsingForInMethod = data => {
    const {statesList} = this.props

    const resultList = []
    const keyNames = Object.keys(data)

    keyNames.forEach(keyName => {
      if (data[keyName]) {
        const {total} = data[keyName]
        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const population = data[keyName].meta.population
          ? data[keyName].meta.population
          : 0
        const lastUpdated = data[keyName].meta.last_updated
          ? data[keyName].meta.last_updated
          : 0
        const districts = data[keyName].districts ? data[keyName].districts : 0
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
            lastUpdated,
            districtsList:
              districts !== 0
                ? this.convertDistrictObjectsIntoList(districts)
                : [],
          })
        }
      }
    })
    return resultList
  }

  convertDistrictObjectsIntoList = data => {
    const resultList = []
    const keyNames = Object.keys(data)
    keyNames.forEach(keyName => {
      if (data[keyName]) {
        const {total} = data[keyName]
        if (total !== undefined) {
          const confirmed = total.confirmed ? total.confirmed : 0
          const deceased = total.deceased ? total.deceased : 0
          const recovered = total.recovered ? total.recovered : 0
          const tested = total.tested ? total.tested : 0

          resultList.push({
            districtName: keyName,
            confirmed,
            deceased,
            recovered,
            tested,
            active: confirmed - (deceased + recovered),
          })
        }
      }
    })
    return resultList
  }

  getCovid19Stats = async () => {
    const response = await fetch('https://apis.ccbp.in/covid19-state-wise-data')
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    const timelineResponse = await fetch(
      `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`,
    )
    const timelineData = await timelineResponse.json()

    if (response.ok) {
      const data = await response.json()
      const statsList = this.convertObjectsDataIntoListItemsUsingForInMethod(
        data,
      )
      const stateStats = statsList.find(state => state.stateCode === stateCode)
      this.setState({
        stateStats,
        isLoading: false,
      })
    }

    if (timelineResponse.ok) {
      const datesList = this.convertDistrictObjectsIntoList(
        timelineData[stateCode].dates,
      )
      const newDatesList = datesList.map(date => ({
        date: date.districtName,
        confirmed: date.confirmed,
        recovered: date.recovered,
        deceased: date.deceased,
        active: date.active,
        tested: date.tested,
      }))
      this.setState({datesList: newDatesList, isTimeLineLoading: false})
    }
  }

  getSortedList = data => {
    const {activeTab} = this.state
    return data.sort((a, b) => {
      if (a[activeTab] < b[activeTab]) {
        return 1
      }
      if (a[activeTab] > b[activeTab]) {
        return -1
      }
      return 0
    })
  }

  convertData = number => {
    if (number > 100000) {
      return `${(number / 100000).toString()}L`
    }
    if (number > 1000) {
      return `${(number / 1000).toString()}k`
    }
    return number.toString()
  }

  renderBarChart = () => {
    const {datesList, activeTab} = this.state

    let color = ''

    if (activeTab === 'confirmed') {
      color = '#9a0e31'
    } else if (activeTab === 'active') {
      color = '#0a4fa0'
    } else if (activeTab === 'recovered') {
      color = '#216837'
    } else {
      color = '#474c57'
    }

    return (
      <div className="bar-chart-container">
        <BarChart width={400} height={450} data={datesList.slice(0, 11)}>
          <XAxis dataKey="date" />
          <Bar
            dataKey={activeTab}
            fill={color}
            className="bar"
            label={{position: 'top', color: 'white'}}
          />
        </BarChart>
      </div>
    )
  }

  renderConfirmedLineChart = () => {
    const {datesList} = this.state
    return (
      <div className="confirmed-line-chart">
        <LineChart
          width={400}
          height={250}
          data={datesList}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis dataKey="date" />
          <YAxis tickFormatter={this.convertData} />
          <Line type="monotone" dataKey="confirmed" stroke="#8884d8" />
        </LineChart>
      </div>
    )
  }

  renderActiveLineChart = () => {
    const {datesList} = this.state
    return (
      <div className="active-line-chart">
        <LineChart
          width={400}
          height={250}
          data={datesList}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis dataKey="date" />
          <YAxis tickFormatter={this.convertData} />
          <Line type="monotone" dataKey="active" stroke="#8884d8" />
        </LineChart>
      </div>
    )
  }

  renderRecoveredLineChart = () => {
    const {datesList} = this.state
    return (
      <div className="recovered-line-chart">
        <LineChart
          width={400}
          height={250}
          data={datesList}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis dataKey="date" />
          <YAxis tickFormatter={this.convertData} />
          <Line type="monotone" dataKey="recovered" stroke="#8884d8" />
        </LineChart>
      </div>
    )
  }

  renderDeceasedLineChart = () => {
    const {datesList} = this.state

    return (
      <div className="deceased-line-chart">
        <LineChart
          width={400}
          height={250}
          data={datesList}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis dataKey="date" />
          <YAxis tickFormatter={this.convertData} />
          <Line type="monotone" dataKey="deceased" stroke="#8884d8" />
        </LineChart>
      </div>
    )
  }

  renderTestedLineChart = () => {
    const {datesList} = this.state
    return (
      <div className="tested-line-chart">
        <LineChart
          width={400}
          height={250}
          data={datesList}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis dataKey="date" />
          <YAxis tickFormatter={this.convertData} />
          <Line type="monotone" dataKey="tested" stroke="#8884d8" />
        </LineChart>
      </div>
    )
  }

  renderStateDetailsLoader = () => (
    <div testid="stateDetailsLoader" className="loader">
      <Loader type="TailSpin" color="#007bff" height="50" width="50" />
    </div>
  )

  renderTimeLinesLoader = () => (
    <div testid="timelinesDataLoader" className="loader">
      <Loader type="TailSpin" color="#007bff" height="50" width="50" />
    </div>
  )

  renderTopDistrictsBasedOnActiveTab = districtDetails => {
    const {districtName} = districtDetails
    const {activeTab} = this.state
    return (
      <li className="district-item" key={districtName}>
        <p className="code">{districtDetails[activeTab]}</p>
        <p className="district-name">{districtName}</p>
      </li>
    )
  }

  render() {
    const {stateStats, activeTab, isLoading, isTimeLineLoading} = this.state
    const {
      lastUpdated,
      tested,
      districtsList,
      name,
      confirmed,
      recovered,
      deceased,
    } = stateStats
    const active = confirmed - (deceased + recovered)
    const confirmedTab = activeTab === 'confirmed' ? 'confirmed-tab' : ''
    const activeCasesTab = activeTab === 'active' ? 'active-tab' : ''
    const recoveredTab = activeTab === 'recovered' ? 'recovered-tab' : ''
    const deceasedTab = activeTab === 'deceased' ? 'deceased-tab' : ''
    const sortedDistrictsList =
      districtsList !== undefined ? this.getSortedList(districtsList) : []
    return (
      <div className="state-specific-route">
        <Header />
        <div className="state-specific-container">
          {!isLoading ? (
            <>
              <div className="tested-details-state-badge-container">
                <div className="state-badge-container">
                  <h1 className="state-badge">{name}</h1>
                  <p className="last-updated">Last update on {lastUpdated}</p>
                </div>
                <div className="tested-container">
                  <p className="tested-text">Tested</p>
                  <p className="tested-count">{tested}</p>
                </div>
              </div>
              <div className="tab-buttons">
                <div testid="stateSpecificConfirmedCasesContainer">
                  <button
                    type="button"
                    className={`state-specific-confirmed-cases-container tab-button ${confirmedTab}`}
                    onClick={this.onClickConfirmedTab}
                  >
                    <p>Confirmed</p>
                    <img
                      src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660062836/check-mark_1_gphcte.png"
                      alt="state specific confirmed cases pic"
                    />
                    <p>{confirmed}</p>
                  </button>
                </div>
                <div testid="stateSpecificActiveCasesContainer">
                  <button
                    type="button"
                    className={`tab-button state-specific-active-cases-container ${activeCasesTab}`}
                    onClick={this.onClickActiveTab}
                  >
                    <p>Active</p>
                    <img
                      src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660063054/protection_1_ogsxmk.png"
                      alt="state specific active cases pic"
                    />
                    <p>{active.toString()}</p>
                  </button>
                </div>
                <div testid="stateSpecificRecoveredCasesContainer">
                  <button
                    type="button"
                    className={`tab-button state-specific-recovered-cases-container ${recoveredTab}`}
                    onClick={this.onClickRecoveredTab}
                  >
                    <p>Recovered</p>
                    <img
                      src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660063197/recovered_1_cvyidz.png"
                      alt="state specific recovered cases pic"
                    />
                    <p>{recovered}</p>
                  </button>
                </div>
                <div testid="stateSpecificDeceasedCasesContainer">
                  <button
                    type="button"
                    className={`tab-button state-specific-deceased-cases-container ${deceasedTab}`}
                    onClick={this.onClickDeceasedTab}
                  >
                    <p>Deceased</p>
                    <img
                      src="https://res.cloudinary.com/dgqprvnnt/image/upload/v1660063120/breathing_1_d6lc0j.png"
                      alt="state specific deceased cases pic"
                    />
                    <p>{deceased}</p>
                  </button>
                </div>
              </div>
              <h1 className="top-districts-heading">Top Districts</h1>
              <ul
                testid="topDistrictsUnorderedList"
                className="top-districts-list"
              >
                {sortedDistrictsList.map(district =>
                  this.renderTopDistrictsBasedOnActiveTab(district),
                )}
              </ul>
            </>
          ) : (
            this.renderStateDetailsLoader()
          )}
          {!isTimeLineLoading ? (
            <div testid="lineChartsContainer">
              {this.renderBarChart()}
              <h1 className="daily-spread-trends">Daily Spread Trends</h1>
              {this.renderConfirmedLineChart()}
              {this.renderActiveLineChart()}
              {this.renderRecoveredLineChart()}
              {this.renderDeceasedLineChart()}
              {this.renderTestedLineChart()}
            </div>
          ) : (
            this.renderTimeLinesLoader()
          )}
        </div>
        <Footer />
      </div>
    )
  }
}

export default State
