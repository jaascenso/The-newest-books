const PORT = process.env.PORT || 9000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const { get } = require('cheerio/lib/api/traversing')

const app = express()

const newspapers = [
    {
        name: 'wook',
        address: 'https://www.wook.pt/destaques/pre-lancamentos/00/00/11379',
        base: 'https://www.wook.pt',
        handler: function (res) {
            const newspaperAddress = this.address
            const newspaperBase = this.base
            const newspaperId = this.name

            axios.get(newspaperAddress)
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    const specificArticles = []

                    $('div[data-product-id]', html).each(function () {
                        const title = $(this).attr('data-product-name')
                        const price = $('div.price > span', this).first().text()
                        const oldPrice = $('div.price > span.price-undercut', this).text().trim()
                        const url = $('a.track', this).attr('href')
                        specificArticles.push({
                            title,
                            price,
                            oldPrice,
                            url: newspaperBase + url,
                            source: newspaperId
                        })
                    })

                    res.json(specificArticles)
                }).catch(err => console.log(err))
        }
    },
    {
        name: 'bertrand',
        address: 'https://www.bertrand.pt/destaques/pre-lancamentos/00/00/9933',
        base: 'https://www.bertrand.pt',
        handler: function (res) {
            const newspaperAddress = this.address
            const newspaperBase = this.base
            const newspaperId = this.name

            axios.get(newspaperAddress)
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    const specificArticles = []

                    $('div[data-product-id]', html).each(function () {
                        const title = $(this).attr('data-product-name')
                        const price = $('div.price > span', this).first().text()
                        const oldPrice = $('div.price > span.price-undercut', this).text().trim()
                        const url = $('a.track', this).attr('href')
                        specificArticles.push({
                            title,
                            price,
                            oldPrice,
                            url: newspaperBase + url,
                            source: newspaperId
                        })
                    })

                    res.json(specificArticles)
                }).catch(err => console.log(err))
        }
    },
    {
        name: 'amazon',
        address: 'https://www.amazon.es/-/pt/gp/new-releases/books/',
        base: 'https://www.amazon.es',
        handler: function (res) {
            const newspaperAddress = this.address
            const newspaperBase = this.base
            const newspaperId = this.name

            axios.get(newspaperAddress)
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    const specificArticles = []

                    // $('li.zg-item-immersion span.zg-item', html).each(() => {
                    $('span.aok-inline-block.zg-item', html).each((a) => {
                        console.log(a)
                        title = $('div.p13n-sc-truncatedspan', this).text()
                        url = $('a.a-link-normal', this).attr('href')
                        price = $('span.p13n-sc-price', this).text()
                        specificArticles.push({
                            title,
                            price,
                            url: newspaperBase + url,
                            source: newspaperId
                        })
                    })
                    res.json(specificArticles)
                }).catch(err => console.log(err))
        }
    },
    {
        name: 'sibila',
        address: 'https://loja.sibila.pt/epages/960852226.sf/pt_PT/?ObjectPath=/Shops/960852226/Categories/Novidades',
        base: 'https://loja.sibila.pt/',
        handler: function (res) {
            const newspaperAddress = this.address
            const newspaperBase = this.base
            const newspaperId = this.name

            axios.get(newspaperAddress)
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    const specificArticles = []

                    console.log(html)
                    $('div.InfoArea', html).each(() => {
                        title = $('h3.TopPaddingWide > a', this).text()
                        url = $('h3.TopPaddingWide > a', this).attr('href')
                        price = $('span.price-value > span[itemprop=price]', this).text()
                        //oldPrice = $('del.thumbnail-priceOld',this).text()
                        priceCurrency = $('span.price-value > span[itemprop=priceCurrency]', this).text()
                        specificArticles.push({
                            title,
                            price,
                            oldPrice,
                            url: newspaperBase + url,
                            source: newspaperId
                        })
                    })
                    res.json(specificArticles)
                }).catch(err => console.log(err))
        }
    }
]

const articles = []

// newspapers.forEach(newspaper => {
//     axios.get(newspaper.address)
//         .then(response => {
//             const html = response.data
//             const $ = cheerio.load(html)

//             $('a:contains("track")', html).each(function(){
//                 const title = $(this).text()
//                 const url = $(this).attr('href')

//                 articles.push({
//                     title,
//                     url: newspaper.base + url,
//                     source: newspaper.name
//                 })
//             })
//         })
// })

newspapers.forEach(newspaper => {
    articles.push(newspaper.name)
})

app.get('/', (req, res) => {
    res.json('Welcome to my API of the newest books \
    ')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {

    const newspaperId = req.params.newspaperId
    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)[0]

    newspaper.handler(res)
})

app.get('/news/amazon', (req, res) => {

    const newspaperId = req.params.newspaperId
    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)[0]

    
    const newspaperAddress = newspaper.address
    const newspaperBase = newspaper.base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            // $('li.zg-item-immersion span.zg-item', html).each(() => {
            $('span.aok-inline-block.zg-item', html).each(() => {
                title = $('div.p13n-sc-truncatedspan', this).text()
                url = $('a.a-link-normal', this).attr('href')
                price = $('span.p13n-sc-price', this).text()
                specificArticles.push({
                    title,
                    price,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on ${PORT}`))