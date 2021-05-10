import 'antd/dist/antd.css'
import './App.css';
import { Layout, Input, Table, Select } from 'antd';
import { useEffect, useState } from 'react';
import fetch from 'node-fetch';

const { Header, Content, Footer } = Layout;
const {Search} = Input;
const {Option} = Select


function App() {
  const [id,setId]=useState(113)
  const [arr,setArr]=useState([])
  const [areas,setAreas]=useState([])

  useEffect(()=>{
    const fetchData = async()=>{
      const response = await fetch('/areas').then(res=>res.json())
      const arr= [{name:response.name,id:response.id}]
      response.areas.forEach(a=>{
        arr.push({name:a.name,id:a.id})
      })
      setAreas(arr)
    }
    fetchData()
  },[])

  const onSearch = async (value) => {
    console.log(id)
    const response = await fetch('/',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({text:value,id})
    }).then(res=>res.json())
    setArr(response)
  }

  const columns = [
    {
      title: 'Слово',
      dataIndex: 'word',
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      sorter: (a, b) => a.value - b.value,
      sortDirections: ['descend'],
    }
  ];
  return (
    <div className="App">
      <Layout className="layout">
        <Header>
        </Header>
        <Content style={{ padding: '0 50px', minHeight:'79vh'}}>
          <div className="site-layout-content">
          <Search
            placeholder="Введите название вакансии."
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            style={{width:"60%",margin:"30px auto"}}
          />
          <Select style={{width:'200px', margin:"30px"}} onChange={(value)=>setId(value)} defaultValue="Россия">
            {areas.sort((a,b)=>a.name-b.name).map(a=>{
                return (<Option key={a.id}  value={a.id}>{a.name}</Option>)
            })}
          </Select>
          <Table columns={columns} dataSource={arr}/>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </div>
  );
}

export default App;
