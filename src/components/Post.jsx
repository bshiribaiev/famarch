import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router';

const Post = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    
    const supabaseUrl = 'https://cwpyfwixtpwflxlzfftg.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const [postData, setPostData] = useState({
        title: '',
        text: '',
        image: '',
        created_at: '',
        votes: 0,
        comments: [],
    });
    
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: '',
        text: '',
        image: ''
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
                    votes: data.votes || 0,
                    comments: Array.isArray(data.comments) ? data.comments : [],
                });
                // Set edit data for editing mode
                setEditData({
                    title: data.title,
                    text: data.text,
                    image: data.image
                });
            } 
        } catch (err) {
            console.error('Unexpected error fetching a post:', err);
        }
    }

    const postComment = async () => {
        if (!newComment.trim()) return;
        try {
            const updatedComments = [...postData.comments, newComment];
            
            const { data, error } = await supabase
                .from('famarch')
                .update({ comments: updatedComments })
                .eq('id', postId) 
                .select()
            if (error) {
                console.error('Error posting comment:', error.message);
            } 
            else {
                console.log('Data loaded to Supabase: ', data)
                setPostData(prev => ({ ...prev, comments: updatedComments }))
                setNewComment(''); 
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    }

    const handleVote = async() => {
        try {
            const newVoteCount = (postData.votes || 0) + 1;
            
            const { data, error } = await supabase
                .from('famarch')
                .update({ votes: newVoteCount })
                .eq('id', postId)
                .select()
    
            if (error) {
                console.error('Error updating votes:', error.message);
            } else {
                console.log('Vote updated:', data);
                setPostData(prev => ({ ...prev, votes: newVoteCount }));
            }
        } catch (err) {
            console.error('Unexpected error voting:', err);
        }
    }

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset edit data to original values
        setEditData({
            title: postData.title,
            text: postData.text,
            image: postData.image
        });
    }

    const handleSaveEdit = async () => {
        try {
            const { data, error } = await supabase
                .from('famarch')
                .update({
                    title: editData.title,
                    text: editData.text,
                    image: editData.image
                })
                .eq('id', postId)
                .select()

            if (error) {
                console.error('Error updating post:', error.message);
            } else {
                console.log('Post updated:', data);
                setPostData(prev => ({
                    ...prev,
                    title: editData.title,
                    text: editData.text,
                    image: editData.image
                }));
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Unexpected error updating post:', err);
        }
    }

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        
        if (confirmDelete) {
            try {
                const { error } = await supabase
                    .from('famarch')
                    .delete()
                    .eq('id', postId)

                if (error) {
                    console.error('Error deleting post:', error.message);
                } else {
                    console.log('Post deleted successfully');
                    // Navigate back to home or posts list
                    navigate('/'); // Adjust the route as needed
                }
            } catch (err) {
                console.error('Unexpected error deleting post:', err);
            }
        }
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => { fetchPost() }, [postId])

    return (
        <div className='postSep'> 
            {isEditing ? (
                // Edit mode
                <div className='edit'>
                    <h1>Edit post</h1>
                    <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleEditInputChange}
                        placeholder="Title"
                    />
                    <input
                        className='descr'
                        name="text"
                        value={editData.text}
                        onChange={handleEditInputChange}
                        placeholder="Description"
                    />
                    <input
                        type="text"
                        name="image"
                        value={editData.image}
                        onChange={handleEditInputChange}
                        placeholder="Image URL"
                    />
                    <br />
                    <button onClick={handleSaveEdit}>Save Changes</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            ) : (
                // View mode
                <div className='viewPost'>
                    <h1>{postData.title}</h1>
                    <p>Description: {postData.text}</p>
                    <p>Created at: {new Date(postData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                    })}</p>
                    <p>Votes: {postData.votes}</p>
                    <img src='/image.png' alt='wedding image'/>
                    
                    <button onClick={handleVote}>Upvote</button>
                    <button onClick={handleEdit}>Edit Post</button>
                    <button onClick={handleDelete}>Delete Post</button>
                </div>
                
            )}
            <div className='commentss'> 
                <h4>Comments</h4>
                {postData.comments && postData.comments.map((comment, index) => (
                    <p key={index}>- {comment}</p>
                ))}
            </div>
 
            <input
                type="text"
                placeholder='Comment'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className='comment'
            />
            <button onClick={postComment}>Post comment</button>
        </div>
    )
}

export default Post