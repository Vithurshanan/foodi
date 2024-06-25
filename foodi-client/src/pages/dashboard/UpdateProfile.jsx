import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { AuthContext } from '../../contexts/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.displayName || '',
            photoURL: user?.photoURL || '',
        }
    });

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const onSubmit = (data) => {
        const name = data.name;
        const photoURL = data.photoURL;
        updateUserProfile(name, photoURL)
            .then(() => {
                setUpdateSuccess(true);
                setUpdateError(null);
                setLoading(false);
                navigate(from, { replace: true });
            })
            .catch((error) => {
                setUpdateError(error.message);
                setUpdateSuccess(false);
                setLoading(false);
            });
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className="card bg-white shrink-0 w-full max-w-sm shadow-2xl">
                <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                    <h3 className='font-bold'>Update Your Profile</h3>
                    {updateError && <p className="text-red-500">{updateError}</p>}
                    {updateSuccess && <p className="text-green-500">Profile updated successfully!</p>}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input 
                            {...register("name", { required: "Name is required" })} 
                            type="text" 
                            placeholder="Your name" 
                            className="input bg-white input-bordered" 
                        />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Photo URL</span>
                        </label>
                        <input 
                            type="text" 
                            {...register("photoURL", { required: "Photo URL is required" })} 
                            placeholder="Photo URL" 
                            className="input bg-white input-bordered" 
                        />
                        {errors.photoURL && <p className="text-red-500">{errors.photoURL.message}</p>}
                    </div>
                    <div className="form-control mt-6">
                        <button 
                            type="submit" 
                            className="btn bg-green text-white" 
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfile;
