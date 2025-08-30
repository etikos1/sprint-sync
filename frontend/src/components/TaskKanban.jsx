import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Select, Tag, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const statusConfig = {
  BACKLOG: { color: 'default', text: 'To Do' },
  IN_PROGRESS: { color: 'blue', text: 'In Progress' },
  REVIEW: { color: 'orange', text: 'Review' },
  COMPLETED: { color: 'green', text: 'Done' }
};

const TaskKanban = ({ tasks, onStatusChange, onEdit, onDelete }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    onStatusChange(taskId, newStatus);
  };

  const columns = Object.keys(statusConfig);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {columns.map((status) => (
          <div key={status}>
            <h3>
              <Tag color={statusConfig[status].color}>
                {statusConfig[status].text} ({tasks.filter(t => t.status === status).length})
              </Tag>
            </h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: '500px', background: '#f0f2f5', padding: '16px', borderRadius: '8px' }}
                >
                  {tasks
                    .filter(task => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ marginBottom: '12px', ...provided.draggableProps.style }}
                          >
                            <Card
                              size="small"
                              title={task.title}
                              extra={
                                <div>
                                  <Button 
                                    type="text" 
                                    icon={<EditOutlined />} 
                                    onClick={() => onEdit(task)}
                                    size="small"
                                  />
                                  <Button 
                                    type="text" 
                                    icon={<DeleteOutlined />} 
                                    onClick={() => onDelete(task.id)}
                                    danger 
                                    size="small"
                                  />
                                </div>
                              }
                            >
                              <p>{task.description || 'No description'}</p>
                              <div style={{ marginTop: '12px' }}>
                                <Select
                                  value={task.status}
                                  onChange={(value) => onStatusChange(task.id, value)}
                                  size="small"
                                  style={{ width: '100%' }}
                                >
                                  {columns.map(col => (
                                    <Option key={col} value={col}>
                                      {statusConfig[col].text}
                                    </Option>
                                  ))}
                                </Select>
                              </div>
                              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                                Logged: {task.totalMinutes} minutes
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskKanban;