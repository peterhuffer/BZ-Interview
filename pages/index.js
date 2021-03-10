import Head from 'next/head'
import React from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'

const hostUrl = 'http://localhost:8080'

const client = axios.create({
  baseURL: hostUrl,
})

const zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/

const WeatherDisplay = ({ name, weather, main, wind }) => {
  console.log(weather)
  console.log(main)
  console.log(wind)
  return (
    <ul>
      <li><h1>Location: {name}</h1></li>
      <li>
        <h3>Summary:</h3>
        {weather.forEach(w => {
          <p>{w.main} - {w.description}</p>
        })}
      </li>
      <li>
        <h3>Temperature:</h3>
        <p>{main.temp}</p>
      </li>
      <li>
        <h3>Wind:</h3>
        <p></p>
      </li>
    </ul>
  )

}

export default function Home() {
  const [zipCode, setZipCode] = React.useState('')
  const [weatherData, setWeatherData] = React.useState(undefined)
  const [error, setError] = React.useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if(!zipCodeRegex.test(zipCode)) {
      setError('Invalid zip code, please provide a value in the format of 12345.')
    }

    client.get('/' + zipCode).then(response => {
      if(response.status === 400) {
        setError('Invalid zip code, please provide a value in the format of 12345.')
      }
      setWeatherData(response.data)
      setError('')
    }).catch(e => {
      console.log(e)
    })
  }

  const handleChange = (e) => {
    e.preventDefault()
    setZipCode(e.target.value)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Please enter a zip code to fetch the weather:
        </label>
        <input type="text" name="zipcode" value={zipCode} onChange={handleChange} />
        <input type="submit" value="Submit" />
      </form>


      {error && <p>{error}</p>}
      {!weatherData && !error ? null : 
        <WeatherDisplay name={weatherData.name} weather={weatherData.weather} main={weatherData.main} wind={weatherData.wind} />
      }
    </>
  )
}
