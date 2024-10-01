'use client'
import { Button } from '@/components/ui/button'
import React, { ReactNode, useState } from 'react'
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { Task, getChatUsersForLiveblocks, setTaskState, updateTask } from './actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

type Props = {
  disabled?: boolean
  task: Task
}

function TaskRow({ task, disabled }: Props) {
  const [isDone, setIsDone] = useState(task.is_done)

  async function onCheckClicked() {
    await setTaskState(task.id, !isDone)
    setIsDone(!isDone)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    console.log(name, description)
    await updateTask(task.id, name, description)
    window.location.reload()
  }

  return (
    <div key={task.id} className={`group flex items-center transition-all w-full ${isDone ? 'text-slate-500' : ''}`}>
      <Button
        variant='link'
        className='text-lg text-inherit disabled:cursor-not-allowed'
        disabled={disabled}
        onClick={onCheckClicked}>
        { isDone ? <FiCheckCircle /> : <FiCircle /> }
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className={`flex-1 justify-start ${isDone && 'line-through'}`}>
            {task.name}
          </Button>
        </DialogTrigger>
        <DialogContent className="md:min-w-[800px] h-[80%]">
          <DialogTitle>
            Edit task
          </DialogTitle>
          <div className="grid md:grid-cols-1 gap-2 h-full">
            <form onSubmit={onSubmit} className='flex flex-col gap-2'>
              <Label htmlFor="name">Name</Label>
              <Input type='text' name='name' defaultValue={task.name as string} disabled={disabled} />
              <Label htmlFor="Description">Description</Label>
              <Textarea name='description' defaultValue={task.description as string} disabled={disabled} />
              <Button type='submit' disabled={disabled}>Save</Button>
            </form>
            <ChatRoom taskId={task.id}>
              <CollaborativeApp />
            </ChatRoom>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskRow

function ChatRoom({ taskId, children }: {
  taskId: number
  children: ReactNode
}) {

  async function resolveUsers({ userIds }: {
    userIds: string[]
  }): Promise<any> {
    const users = await getChatUsersForLiveblocks(userIds)
    return users
  }

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={resolveUsers}>
      <RoomProvider id={`task_${taskId}`}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

import { useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";

export function CollaborativeApp() {
  const { threads } = useThreads();

  return (
    <div className='flex flex-col gap-2'>
      {threads.map((thread) => (
        <Thread
          className='border border-slate-500 rounded-lg'
          key={thread.id}
          thread={thread} />
      ))}
      <Composer />
    </div>
  );
}