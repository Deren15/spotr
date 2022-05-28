import React, { useState, useEffect }  from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';
 
const cookies = new Cookies();

const App = () => {

  const [token, setToken] = useState('')
  const [items, setItems] = useState([])

  const REDIRECT_URI = "http://localhost:3000"

  // console.log(items)

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      // getToken()


      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
          console.log(token)
          cookies.set("token", token, { path: "/" })
      }
      // console.log(token)
      setToken(token)

  }, [])

  useEffect(() => {
    const getData = async() => {
        let tokes = cookies.get("token")
        if(tokes) {
          const res = await axios(`https://recent-spot-back.herokuapp.com/tracks?bearer=${tokes}&limit=10`)
          const { items }= res.data
          setItems(items)
        }
    }
    getData()
  }, [token])

  const clearAll = () => {
    window.localStorage.clear()
    cookies.remove("token")
    setToken('')
  }

  console.log(process.env)

  return (
    <div>
      <main className="flex flex-col items-center justify-center py-4">
          <div>
            <h1 className="text-4xl text-white font-extrabold">Devesh B</h1>
            <a 
              href={`${process.env.REACT_APP_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE}&scope=user-read-recently-played`}
              className="py-2 my-2 px-4 bg-white text-black border"
            >Login</a>
          </div>

          <div className='mt-10 text-center'>
            <h1 className="text-2xl text-white font-extrabold">Currently Listening</h1>
            <div className='px-4 md:px-8 mt-5 grid grid-cols-1 md:grid-cols-5 gap-2 items-center justify-center'>
            {items && items.map((item, i) => {
                return (
                  <div key={i} className='flex flex-col items-center justify-center'>
                    <img src={item.track.album.images[0].url} alt={item.track.album.name} width={100} height={100} />
                    <h1 className='text-white'>{item.track.name}</h1>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <button className='bg-white py-2 px-4' onClick={clearAll}>Clear All</button>
          </div>

      </main>

      
    </div>
  )
}

// export const getStaticProps = async (context) => {
//   // console.log('in')
//   let token = cookies.get("token")
//   console.log(context.req.headers)
//   // console.log(res)
//   console.log(token)
//     if(token) {
      // const res = await axios(`http://localhost:8000/?bearer=${token}&limit=10`)
      // const { items }= res.data
//       // console.log(data)
//       return {
//         props: {
//           items
//         },
//       }
//     } else {
//       return {
//         props: {
//           items: []
//         },
//       }
//     }
  
// }

export default App
