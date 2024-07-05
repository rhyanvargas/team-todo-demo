import AddTaskForm from "./AddTaskForm";
import TaskRow from "./TaskRow";
import { getTasks } from "./actions";

export default async function Home() {
  const tasks = await getTasks()

  return (
    <div className='flex flex-col'>
      <AddTaskForm />
      <div className='flex flex-col gap-2 p-2'>
        {tasks.map(task => <TaskRow key={task.id} task={task} />)}
      </div>
    </div>
  );
}
