import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function HiwForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authAxios } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  useEffect(() => {
    if (id) {
      fetchHiw();
    }
  }, [id]);

  const fetchHiw = async () => {
    try {
      const response = await authAxios.get(`${url}/api/hiws/${id}`);
      setFormData(response.data);
      setIconPreview(`${url}/${response.data.icon}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching HIW');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!id && !iconFile) {
      setError('Icon is required for new HIW');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      if (iconFile) form.append('icon', iconFile);

      if (id) {
        await authAxios.put(`${url}/api/hiws/${id}`, form);
      } else {
        await authAxios.post(`${url}/api/hiws`, form);
      }
      navigate('/dashboard/hiws');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving HIW');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{id ? 'Edit HIW' : 'New HIW'}</h2>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/hiws')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Icon</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {iconPreview && (
            <img src={iconPreview} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded-md" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </form>
  );
}