import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { MonthCalendarView } from '@/components/calendar/MonthCalendarView';
import { WeekCalendarView } from '@/components/calendar/WeekCalendarView';
import { useTaskStore } from '@/store/taskStore';
import { useUiStore } from '@/store/uiStore';

export const CalendarPage = () => {
  const { openAddTask } = useUiStore();
  const { tasks, isLoading, fetchTasks, setSelectedTask } = useTaskStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() - 1);
    } else {
      next.setDate(next.getDate() - 7);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setDate(next.getDate() + 7);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectDay = (date) => {
    openAddTask({
      dueDate: date.toISOString(),
    });
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Calendar"
        subtitle="Schedule and timeline visualization across all projects and deadlines"
      />

      {/* Calendar Top Navigation Header */}
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onNewTask={() =>
          openAddTask({
            dueDate: currentDate.toISOString(),
          })
        }
      />

      {/* Calendar Grid Display */}
      {viewMode === 'month' ? (
        <MonthCalendarView
          currentDate={currentDate}
          tasks={tasks}
          onSelectTask={handleSelectTask}
          onSelectDay={handleSelectDay}
        />
      ) : (
        <WeekCalendarView
          currentDate={currentDate}
          tasks={tasks}
          onSelectTask={handleSelectTask}
          onSelectDay={handleSelectDay}
        />
      )}
    </PageContainer>
  );
};
