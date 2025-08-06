import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const supabaseUrl = 'https://cwpyfwixtpwflxlzfftg.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    const [posts, setPosts] = useState([])

    const fetchPosts = async() => {
        try {
            const { data, error } = await supabase
                .from('famarch')
                .select('id, created_at, title, votes')

                if (error) {
                    console.error('Fetching error: ', error.message)
                } 
                else {
                    console.log('Data loaded from Supabase: ', data)
                    const sortedData = [...data].sort((a, b) => b.id - a.id)
                    setPosts(sortedData)
                }
        }
        catch (err) {
            console.error('Error: ', err)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <div className='current'> 
            {posts && (
                posts.map((post) => (
                    <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div key={post.id} className='post'>
                            <h3>{post.title}</h3>
                            <p>Posted at: {post.created_at}</p>
                            {post.votes ? (<p>{post.votes} upvotes</p>)
                            : <p>0 upvotes</p>}
                        </div>
                    </Link>
                ))
            )}
        </div> 
    )
}

export default Home;