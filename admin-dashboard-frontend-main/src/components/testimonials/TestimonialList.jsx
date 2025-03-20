// components/testimonials/TestimonialList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function TestimonialList() {
  const { authAxios } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await authAxios.get(`${url}/api/testimonials`);
      setTestimonials(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching testimonials');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await authAxios.delete(`${url}/api/testimonials/${id}`);
        setTestimonials(testimonials.filter((t) => t._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting testimonial');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Testimonials</h2>
        <Link to="/dashboard/testimonials/new" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Add Testimonial
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testimonials.map((testimonial) => (
              <tr key={testimonial._id}>
                <td className="px-6 py-4 whitespace-nowrap">{testimonial.name}</td>
                <td className="px-6 py-4">{testimonial.description || '-'}</td>
                <td className="px-6 py-4">
                  {testimonial.image ? (
                    <img src={`${url}/${testimonial.image}`} alt={testimonial.name} className="h-10 w-10 object-cover rounded" />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/dashboard/testimonials/edit/${testimonial._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit size={20} />
                  </Link>
                  <button onClick={() => handleDelete(testimonial._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}