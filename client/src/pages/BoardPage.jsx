import React, { useEffect } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { TaskBoardView } from '@/components/tasks/TaskBoardView';
import { TaskSkeleton } from '@/components/ui/Skeleton';
import { useUiStore } from '@/store/uiStore';
import { useTaskStore } from '@/store/taskStore';
import { Plus } from 'lucide-react';

export const BoardPage = () => {
  const { openAddTask } = useUiStore();
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <PageContainer>
      <PageHeader
        title="Board"
        subtitle="Visual Kanban pipeline and status progression across all active tasks"
        actions={
          <Button
            variant="primary"
            onClick={() => openAddTask()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Task
          </Button>
        }
      />

      {isLoading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      ) : (
        <TaskBoardView tasks={tasks} />
      )}
    </PageContainer>
  );
};
