import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function TeamList() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authAxios } = useContext(AuthContext);
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await authAxios.get(url + '/api/team');
      setTeam(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching team members');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      await authAxios.delete(url + `/api/team/${id}`);
      setTeam(team.filter(member => member._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting team member');
    }
  };

  const handleReorder = async (id, direction) => {
    const currentMember = team.find(m => m._id === id);
    const currentIndex = team.findIndex(m => m._id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= team.length) return;

    const targetMember = team[newIndex];
    
    try {
      await authAxios.put(url + '/api/team/reorder', {
        orders: [
          { id: currentMember._id, order: targetMember.order },
          { id: targetMember._id, order: currentMember.order }
        ]
      });
      
      fetchTeam(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Error reordering team members');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <Link
          to="/dashboard/team/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Team Member
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {team.map((member) => (
            <li key={member._id} className="hover:bg-gray-50">
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    {member.image?.file ? (
                      <img
                        src={member.image.file}
                        alt={member.image.alt}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400 border rounded-full p-2" />
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {member.name}
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {member.category}
                        </span>
                        {!member.active && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{member.description}</p>
                      <div className="mt-2 flex space-x-4">
                        {member.socialMedia?.linkedin && (
                          <a href={member.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                            LinkedIn
                          </a>
                        )}
                        {member.socialMedia?.twitter && (
                          <a href={member.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                            Twitter
                          </a>
                        )}
                        {member.socialMedia?.facebook && (
                          <a href={member.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                            Facebook
                          </a>
                        )}
                        {member.socialMedia?.instagram && (
                          <a href={member.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                            Instagram
                          </a>
                        )}
                        {member.socialMedia?.website && (
                          <a href={member.socialMedia.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReorder(member._id, 'up')}
                        disabled={team.indexOf(member) === 0}
                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(member._id, 'down')}
                        disabled={team.indexOf(member) === team.length - 1}
                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/dashboard/team/${member._id}/edit`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}