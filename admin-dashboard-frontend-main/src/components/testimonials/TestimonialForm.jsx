// components/testimonials/TestimonialForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function TestimonialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authAxios } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchTestimonial();
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      const response = await authAxios.get(`${url}/api/testimonials/${id}`);
      setFormData({
        name: response.data.name,
        description: response.data.description || '',
      });
      setExistingImage(response.data.image);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching testimonial');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (id) {
        await authAxios.put(`${url}/api/testimonials/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await authAxios.post(`${url}/api/testimonials`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/dashboard/testimonials');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
        <div className="flex space-x-4">
          <button type="button" onClick={() => navigate('/dashboard/testimonials')} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <X className="h-5 w-5 mr-2" /> Cancel
          </button>
          <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
            <Save className="h-5 w-5 mr-2" /> {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-4"><div className="text-sm text-red-700">{error}</div></div>}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" rows="3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          {existingImage && !imageFile && (
            <div className="mt-1">
              <img src={`${url}/${existingImage}`} alt="Current" className="h-20 w-20 object-cover rounded" />
              <p className="text-sm text-gray-500">Current image</p>
            </div>
          )}
          <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
        </div>
      </div>
    </form>
  );
}