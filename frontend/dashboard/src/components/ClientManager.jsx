import { useState, useEffect } from 'react';
import { createClient, listClients } from '../services/api';
import './ClientManager.css'; // Import the new CSS file

export default function ClientManager() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website_url: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await listClients();
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClient(formData);
      setShowForm(false);
      setFormData({ name: '', email: '', website_url: '' });
      loadClients();
      alert('Client created successfully!');
    } catch (error) {
      alert('Error creating client: ' + error.message);
    }
  };

  const copyApiKey = (apiKey) => {
    navigator.clipboard.writeText(apiKey);
    alert('API Key copied to clipboard!');
  };

  return (
    <div className="client-container">
      <div className="client-header">
        <h2 className="client-title">Client Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Client'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3 className="form-title">Create New Client</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Website URL</label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) =>
                  setFormData({ ...formData, website_url: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Create Client
            </button>
          </form>
        </div>
      )}

      <div className="table-card">
        <table className="client-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>API Key</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>
                  <div className="api-key">
                    <code>{client.api_key.substring(0, 20)}...</code>
                    <button
                      onClick={() => copyApiKey(client.api_key)}
                      className="copy-btn"
                    >
                      Copy
                    </button>
                  </div>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      client.is_active ? 'active' : 'inactive'
                    }`}
                  >
                    {client.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
