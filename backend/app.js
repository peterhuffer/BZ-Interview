const cors = require('cors')
const express = require('express');
const app = express();
const axios = require('axios')

const cache = {}

const hostUrl = 'https://api.openweathermap.org'
const appId = '284027b5cfc736b902b27754a7064f44'

const zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/

const client = axios.create({
  baseURL: hostUrl,
  params: {
    appId 
  }
})

// {
//     timestamp
//     data
// }

app.use(cors())

app.get('/:zipCode', (req, res) => {
    const zipCode = req.params.zipCode

    if (!zipCodeRegex.test(zipCode)) {
        res.send(400)
    }

    const requestTimestamp = new Date()

    if (cache[zipCode]) {
        const cacheEntry = cache[zipCode]
        const expireTime = new Date(cacheEntry.timestamp.getDate() + 1)

        if (cacheEntry.timestamp > expireTime) {
            client.get('/data/2.5/weather', {
                params: {
                    zip: zipCode
                }
                }).then(response => {
                    cache[zipCode] = {
                        data: response.data,
                        timestamp: requestTimestamp
                    }
                    res.send(response.data)
                }).catch(e => {
                    console.log(e)
                    res.sendStatus(500)
                })
        } else {
            res.send(cache[zipCode].data)
        }
    }

    client.get('/data/2.5/weather', {
      params: {
        zip: zipCode
      }
    }).then(response => {
      cache[zipCode] = {
          data: response.data,
          timestamp: requestTimestamp
      }
      res.send(response.data)
    }).catch(e => {
      if (e.status === 404) {
        res.sendStatus(404)
      }
      console.log(e)
      res.sendStatus(500)
    })
});

app.listen(8080, () => console.log('Backend listening on port 8080!'));