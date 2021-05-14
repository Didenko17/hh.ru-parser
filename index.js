const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const { response } = require('express')

const app = express()

app.use(bodyParser.json())

app.get('/areas', async(req,res)=>{
    const response = await fetch(`https://api.hh.ru/areas/113`).then(response=>response.json())
    return res.json(response)
})

app.post('/', async (req,res)=>{
    const {text,id} = req.body
    const map = new Map()
    let found=0;
    let showed=0;
    const today = new Date ();
    const month = today.getMonth()
    const year = today.getFullYear() 
    const day =  today.getDate()
    let startDate = new Date (year,month-1,day+1)
    let endDate = new Date (year, month-1, day+7)
    while(startDate<today){
        for(let i=0; i<20;i++){
            const response = await fetch(`https://api.hh.ru/vacancies?text=${encodeURIComponent(text)}&per_page=100&page=${i}&area=${id}&date_from=${startDate.toISOString()}&date_to=${endDate.toISOString()}`).then(response=>response.json())
            if(i==0){
                found +=response.found
                showed += response.found<=2000?response.found:2000;
            }
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
            if(response.items.length<100){
                break;
            }
        }
        startDate = endDate
        endDate = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate()+7)
    }
    const arr = []
    let i=0
    map.forEach((value, key, map) => {
        arr.push({key:i,word:key,value}); 
        i++;
    });    
    return res.json({arr,found,showed})
})

app.listen(4000,()=>{
    console.log("App is running on 4000 port")
})