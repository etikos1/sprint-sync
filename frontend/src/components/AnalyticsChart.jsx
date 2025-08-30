import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsChart = ({ taskData, timeData, statusData }) => {
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!taskData || taskData.length === 0) {
    return (
      <div style={{ 
        height: 400, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#999'
      }}>
        No data available for analytics
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Time Tracking Chart */}
      <div style={{ marginBottom: 32 }}>
        <h3>Time Logged Per Day (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value} minutes`, 'Time Logged']} />
            <Legend />
            <Bar dataKey="minutes" fill="#1890ff" name="Time Logged" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Task Completion Trend */}
      <div style={{ marginBottom: 32 }}>
        <h3>Task Completion Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={taskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#8884d8" name="Tasks Created" />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Tasks Completed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Task Status Distribution */}
      <div>
        <h3>Task Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} tasks`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;