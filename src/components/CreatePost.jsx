import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'
const CreatePost = () => {
    const supabaseUrl = 'https://cwpyfwixtpwflxlzfftg.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
    });
    
    const handleInput = (e) => { 
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
           [name]:value
        }))
    }

    const handleSubmit= async(e) => {
        try {
            const { data, error } = await supabase
                .from('famarch')
                .insert([
                    {
                        title: formData.title,
                        text: formData.description,
                        image: formData.imageUrl
                    }
                ])
                .select();

                if (error) {
                    console.error('Supabase insert error: ', error.message)
                } 
                else {
                    console.log('Data loaded to Supabase: ', data)
                    setFormData({
                        title: '',
                        description: '',
                        imageUrl: ''
                    });
                }
        }
        catch (err) {
            console.error('Error: ', err)
        }
    }
    return (
        <div className='add'> 
            <h2>New post</h2>
            <input type='text' name='title' value={formData.title} placeholder='Title' onChange={handleInput}/>
            <input type='text' name='description' value={formData.description} placeholder='Description (Optional)' onChange={handleInput}/>
            <input type='text' name='imageUrl' value={formData.imageUrl} placeholder='Image URL (Optional)' onChange={handleInput}/>
        
            <button onClick={handleSubmit}>Create</button>

        </div> 
    )
}

export default CreatePost