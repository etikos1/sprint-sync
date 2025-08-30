/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, DatePicker } from 'antd';
import AnalyticsChart from '../components/AnalyticsChart';
import { fetchTasks } from '../services/api';

const { RangePicker } = DatePicker;

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalTime: 0,
    avgTimePerTask: 0
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetchTasks();
      let userTasks = response.data.data;

      // Filter by date range if selected
      if (dateRange.length === 2) {
        const [startDate, endDate] = dateRange;
        userTasks = userTasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= startDate && taskDate <= endDate;
        });
      }

      setTasks(userTasks);
      calculateStats(userTasks);
      setError('');
    } catch (error) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userTasks) => {
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(task => task.status === 'COMPLETED').length;
    const totalTime = userTasks.reduce((sum, task) => sum + (task.totalMinutes || 0), 0);
    const avgTimePerTask = totalTasks > 0 ? Math.round(totalTime / totalTasks) : 0;

    setStats({
      totalTasks,
      completedTasks,
      totalTime,
      avgTimePerTask
    });
  };

  const processChartData = () => {
    // Process data for time tracking chart (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const timeData = last7Days.map(date => {
      const dayTasks = tasks.filter(task => 
        task.createdAt && task.createdAt.startsWith(date)
      );
      const minutes = dayTasks.reduce((sum, task) => sum + (task.totalMinutes || 0), 0);
      return { date: date.slice(5), minutes };
    });

    // Process data for task completion trend
    const taskData = last7Days.map(date => {
      const dayTasks = tasks.filter(task => 
        task.createdAt && task.createdAt.startsWith(date)
      );
      const created = dayTasks.length;
      const completed = dayTasks.filter(task => task.status === 'COMPLETED').length;
      return { date: date.slice(5), created, completed };
    });

    // Process data for status distribution
    const statusCounts = {
      BACKLOG: 0,
      IN_PROGRESS: 0,
      REVIEW: 0,
      COMPLETED: 0
    };

    tasks.forEach(task => {
      if (statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++;
      }
    });

    const statusData = Object.entries(statusCounts)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        value
      }));

    return { timeData, taskData, statusData };
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates || []);
  };

  const { timeData, taskData, statusData } = processChartData();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        style={{ margin: '20px' }}
      />
    );
  }

  return (
    <div>
      {/* Date Range Filter */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>Filter by date range:</span>
          <RangePicker onChange={handleDateRangeChange} />
          <span style={{ color: '#666', fontSize: '14px' }}>
            {dateRange.length === 0 ? 'Showing all time data' : 'Filtered view'}
          </span>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Tasks" 
              value={stats.totalTasks} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Completed Tasks" 
              value={stats.completedTasks} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Time" 
              value={stats.totalTime} 
              suffix="min"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Avg Time/Task" 
              value={stats.avgTimePerTask} 
              suffix="min"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Completion Rate Card */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Statistic 
              title="Completion Rate" 
              value={stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0} 
              suffix="%"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Card title="Task Analytics">
        <AnalyticsChart 
          taskData={taskData} 
          timeData={timeData} 
          statusData={statusData} 
        />
      </Card>

      {/* Data Summary */}
      {tasks.length === 0 && (
        <Alert
          message="No Data"
          description="You haven't created any tasks yet. Start creating tasks to see analytics."
          type="info"
          style={{ marginTop: 24 }}
        />
      )}
    </div>
  );
};

export default Analytics;