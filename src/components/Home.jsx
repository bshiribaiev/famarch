import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const supabaseUrl = 'https://cwpyfwixtpwflxlzfftg.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    const [originalPosts, setOriginalPosts] = useState([])
    const [posts, setPosts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

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
                    setOriginalPosts(data)
                    setPosts(data)
                }
        }
        catch (err) {
            console.error('Error: ', err)
        }
    }

    const sortByDate = () => {
        const sortedData = [...posts].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
        setPosts(sortedData)
    } 

    const sortByVotes = () => {
        const sortedData = [...posts].sort((a, b) => b.votes - a.votes)
        setPosts(sortedData)
    } 

    useEffect(() => {
        fetchPosts()
    }, [])

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        
        const filteredList = originalPosts.filter(post =>
            post.title.toLowerCase().includes(lowercasedQuery)
        );

        setPosts(filteredList);

    }, [searchQuery, originalPosts]);

    return (
        <div className='current'> 
            <h1>Family Archives</h1>
            <input
                type="text"
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search'
            />

            {posts && (
                <>  
                    <p>Order by: 
                        <button onClick={sortByDate}>Latest</button> 
                        <button onClick={sortByVotes}>Most Popular</button> 
                    </p>
                    {posts.map((post) => (
                        <Link key={post.id} to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className='post'>
                                <h3>{post.title}</h3>
                                <p>Posted at: {post.created_at}</p>
                                {post.votes ? (<p>{post.votes} upvotes</p>)
                                : <p>0 upvotes</p>}
                            </div>
                        </Link>
                    ))}
                </>
            )}
        </div> 
    )
}

export default Home;