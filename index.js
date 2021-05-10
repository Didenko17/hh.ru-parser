const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()

app.use(bodyParser.json())

app.get('/areas', async(req,res)=>{
    const response = await fetch(`https://api.hh.ru/areas/113`).then(response=>response.json())
    return res.json(response)
})

app.post('/', async (req,res)=>{
    const {text,id} = req.body
    const map = new Map()
    for(let i=0; i<20;i++){
        const response = await fetch(`https://api.hh.ru/vacancies?text=${encodeURIComponent(text)}&per_page=100&page=${i}&area=${id}`).then(response=>response.json())
        response.items.forEach(a=>{
            const requirements=a.snippet.requirement;
            if(requirements){
                const arr=requirements.replace(/[.,#!$%\^&\*;:{}=\\"_`~()]|<highlighttext>|<\/highlighttext>/g,"").split(' ')
                arr.forEach(b=>{
                    const word=b.toLowerCase()
                    map.get(word)===undefined?map.set(word,1):map.set(word,map.get(word)+1)
                })
            }
            
        })
    }
    const arr = []
    let i=0
    map.forEach((value, key, map) => {
        arr.push({key:i,word:key,value}); 
        i++;
    });    
    return res.json(arr)
})

app.listen(4000,()=>{
    console.log("App is running on 4000 port")
})