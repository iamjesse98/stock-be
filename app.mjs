import express from 'express'
import request from 'request'
import unzipper from 'unzipper'
import cors from 'cors'
// import csv from 'csvtojson'
// import zlib from 'zlib'

function csvJSON(csv) {
    let lines = csv.split(",\n")
    let result = []
    let headers = lines[0].split(",")
    for (let i = 1; i < lines.length; i++) {
        let obj = {}
        let currentline = lines[i].split(",")
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j]
        }
        result.push(obj)
    }
    //return result; //JavaScript object
    return result //JSON
}

const app = express()

app.use(cors())

app.get(`/`, (req, res) => {
    res.send(`hello`)
})

app.get('/get/:yr/:mn/:dt/:ty', (req, res) => {
    const { yr, mn, dt, ty } = req.params
    const url = `https://www.nseindia.com/content/historical/EQUITIES/${yr}/${mn}/cm${dt}${mn}${yr}${ty}.csv.zip`
    // console.log(url)
    // request(url).pipe(zlib.createGunzip()).pipe(console.log)
    
    // zlib.gunzip(request(url), (err, result) => {
    //     err && console.error(err);
    //     console.log(result);
    // })

    unzipper.Open.url(request, url)
        .then(d => {
            const file = d.files[0];
            return file.buffer();
        })
        .then(data => {
            // console.log(d.toString())
            const t = data.toString()
            // const fields = t.shift().split(',') // ["SYMBOL", "SERIES", "OPEN", "HIGH", "LOW", "CLOSE", "LAST", "PREVCLOSE", "TOTTRDQTY", "TOTTRDVAL", "TIMESTAMP", "TOTALTRADES", "ISIN"]   
            // t.shift()
            // csv()
            //     .fromString(t)
            //     .on('csv', row => { // an array of csv cols like [col1, col2, col3 ...]
            //         console.log(row)
            //         res.json({ url, row })
            //     })
            res.json({
                url,
                fields: t.split(',\n')[0].split(','),
                row: csvJSON(t)
            })
        })
})

app.listen(3003, _ => console.log(`up and listening on 3003!!!`))