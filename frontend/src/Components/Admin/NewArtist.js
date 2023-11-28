import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { getToken } from '../../utils/helpers';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewArtist = () => {

    const [name, setName] = useState('');
    // const [alias, setAlias] = useState('');
    // const [description, setDescription] = useState('');
    // const [images, setImages] = useState([]);
    // const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState('')
    const [product, setProduct] = useState({})

    // const categories = [
    //     'Accessories',
    //             'Clothing & Apparel',
    //             'Drinkware',
    //             'Event Merchandise',
    //             'Home Decor',
    //             'Phone Case & Tech Accesories',
    //             'Prints & Poster',
    //             'Toys & Collectibles',
    //             'Stationery',
    // ]

    let navigate = useNavigate()
    
    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        // formData.set('alias', alias);
        // formData.set('description', description);
        // formData.set('category', category);
        // formData.set('stock', stock);
        // formData.set('seller', seller);

        // images.forEach(image => {
        //     formData.append('images', image)
        // })
        
        NewArtist(formData)
    }

    // const onChange = e => {
    //     const files = Array.from(e.target.files)
    //     setImagesPreview([]);
    //     setImages([])
    //     files.forEach(file => {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             if (reader.readyState === 2) {
    //                 setImagesPreview(oldArray => [...oldArray, reader.result])
    //                 setImages(oldArray => [...oldArray, reader.result])
    //             }
    //         }
            
    //         reader.readAsDataURL(file)
    //         // console.log(reader)
    //     })
       
    // }
    const NewArtist = async (formData) => {
       
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/artist/admin/new`, formData, config)
            setLoading(false)
            setSuccess(data.success)
            setProduct(data.product)
        } catch (error) {
            setError(error.response.data.message)

        }
    }
    useEffect(() => {

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (success) {
            navigate('/admin/artist');
            toast.success('Product created successfully', {
                position: toast.POSITION.BOTTOM_RIGHT
            })

        }

    }, [error, success,])


    return (
        <Fragment>
            <MetaData title={'New Artist'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">New Artist</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                             

                               

                                
                             
                               

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                // disabled={loading ? true : false}
                                >
                                    CREATE
                                </button>

                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}
export default NewArtist
