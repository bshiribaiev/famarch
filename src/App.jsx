import './App.css'
import CreatePost from './components/CreatePost'
import Home from './components/Home'
import Post from './components/Post'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='create' element={<CreatePost/>} />
      <Route path='post/:postId' element={<Post/>} /> 
    </Routes>
  )
}

export default App
