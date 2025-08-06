import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router';

const Post = () => {
    const { postId } = useParams();

    const supabaseUrl = 'https://cwpyfwixtpwflxlzfftg.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    const [postData, setPostData] = useState({
        title: '',
        text: '',
        image: '',
        created_at: '',
        votes: '',
    });

    const fetchPost = async () => {
        try {
            const { data, error } = await supabase
                .from('famarch')
                .select('*')
                .eq('id', postId) 
                .single()

            if (error) {
                console.error('Error fetching post for update:', error.message);
            } 
            else if (data) {
                setPostData({
                    title: data.title,
                    text: data.text,
                    image: data.image,
                    created_at: data.created_at,
                    votes: data.votes,
                });
            } 
        } catch (err) {
            console.error('Unexpected error fetching a post:', err);
        }
    }

    useEffect( () => {fetchPost()}, [postId])

    return (
        <div > 
            <h3>{postData.title}</h3>
            <p>Description: {postData.text}</p>
            <p>Created at: {postData.created_at}</p>
            <p>Votes: {postData.votes}</p>
            <p>image: {postData.image}</p>

        </div>
    )
}
export default Post