import { useState, useEffect } from 'react';
import { getAnalytics, getLeads } from '../services/api';
import './Analytics.css'; // Import the new CSS file

export default function Analytics({ apiKey }) {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (apiKey) {
      loadAnalytics();
      loadLeads();
    }
  }, [apiKey]);

  const loadAnalytics = async () => {
    try {
      const response = await getAnalytics(apiKey);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadLeads = async () => {
    try {
      const response = await getLeads(apiKey);
      setLeads(response.data);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  if (!stats) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="analytics-container">
      <h2 className="dashboard-title">Analytics Dashboard</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Total Conversations</h3>
          <p className="stat-value">{stats.total_chats}</p>
          <p className="stat-subtext">+{stats.chats_today} today</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Leads Collected</h3>
          <p className="stat-value">{stats.leads_collected}</p>
          <p className="stat-subtext">+{stats.leads_today} today</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Avg Response Time</h3>
          <p className="stat-value">{stats.avg_response_time}s</p>
          <p className="stat-subtext green">Excellent</p>
        </div>
      </div>

      {/* Top Queries */}
      <div className="section-card">
        <h3 className="section-title">Top Questions</h3>
        <ul className="query-list">
          {stats.top_queries.map((query, idx) => (
            <li key={idx} className="query-item">
              <span className="query-rank">#{idx + 1}</span>
              <span className="query-text">{query}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Leads */}
      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">Recent Leads</h3>
        </div>
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone || '-'}</td>
                <td>{new Date(lead.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
