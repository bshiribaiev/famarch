import './App.css'
import CreatePost from './components/CreatePost'
import Home from './components/Home'
import Post from './components/Post'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path='create' element={<CreatePost/>} />
      <Route path='home' element={<Home/>} />
      <Route path='post/:postId' element={<Post/>} /> 
      <Route path='/' element={
        <div className='app'> 
          <h1>Family Archives</h1>
        </div>
      }/>
    </Routes>
  )
}

export default App
