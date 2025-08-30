import React, { useState } from 'react';
import { Button, Input, Space, message, Card } from 'antd';
import { BulbOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { getAISuggestion } from '../services/api';

const AIAssistant = ({ onSuggestionGenerated }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGetSuggestion = async () => {
    if (!title.trim()) {
      message.warning('Please enter a task title first');
      return;
    }

    setLoading(true);
    setSuggestion('');
    setCopied(false);
    
    try {
      const response = await getAISuggestion(title);
      const aiSuggestion = response.data.description;
      
      setSuggestion(aiSuggestion);
      message.success('AI suggestion generated!');
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to get AI suggestion';
      message.error(errorMessage);
      
      // Provide a fallback suggestion if API fails
      const fallbackSuggestion = `This task involves: ${title}. Consider breaking it down into smaller steps.`;
      setSuggestion(fallbackSuggestion);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySuggestion = () => {
    navigator.clipboard.writeText(suggestion)
      .then(() => {
        setCopied(true);
        message.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        message.error('Failed to copy');
      });
  };

  const handleUseSuggestion = () => {
    if (onSuggestionGenerated) {
      onSuggestionGenerated(suggestion);
      message.success('Suggestion applied!');
    }
  };

  const handleClear = () => {
    setTitle('');
    setSuggestion('');
    setCopied(false);
  };

  return (
    <div style={{ width: '100%' }}>
      <Space.Compact style={{ width: '100%', marginBottom: 8 }}>
        <Input
          placeholder="Enter task title for AI suggestion"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={handleGetSuggestion}
          disabled={loading}
          size="middle"
        />
        <Button 
          type="default" 
          icon={<BulbOutlined />} 
          loading={loading}
          onClick={handleGetSuggestion}
          style={{ minWidth: 100 }}
        >
          {loading ? '...' : 'Suggest'}
        </Button>
        {(suggestion || title) && (
          <Button onClick={handleClear} size="middle">
            Clear
          </Button>
        )}
      </Space.Compact>

      {suggestion && !loading && (
        <Card 
          size="small" 
          style={{ marginTop: 8, border: '1px solid #d9d9d9' }}
          bodyStyle={{ padding: '12px' }}
        >
          <div style={{ 
            marginBottom: 8, 
            fontSize: '13px',
            lineHeight: '1.5',
            color: '#333'
          }}>
            {suggestion}
          </div>
          <Space size="small">
            <Button 
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              size="small"
              onClick={handleCopySuggestion}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button 
              type="link" 
              size="small"
              onClick={handleUseSuggestion}
              style={{ padding: 0 }}
            >
              Use Suggestion
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;