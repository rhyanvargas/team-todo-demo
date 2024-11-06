'use client'
import { Button } from '@/components/ui/button'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { Task, getChatUsersForLiveblocks, getOrgUserList, setTaskState, updateTask } from './actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
        <DialogContent className="md:min-w-[800px] h-[80%] flex flex-col">
          <DialogTitle>
            Edit task
          </DialogTitle>
          <div className="h-full overflow-scroll overflow-x-hidden flex flex-col gap-2 p-2">
            <form onSubmit={onSubmit} className='flex flex-col gap-2'>
              <Label htmlFor="name">Name</Label>
              <Input type='text' name='name' defaultValue={task.name as string} disabled={disabled} />
              <Label htmlFor="Description">Description</Label>
              <Textarea name='description' defaultValue={task.description as string} disabled={disabled} />
              <Button type='submit' disabled={disabled}>Save</Button>
            </form>
            <h2 className="text-sm font-semibold">
              Comments
            </h2>
            <div>
              <ChatRoom taskId={task.id}>
                <CollaborativeApp />
              </ChatRoom>
            </div>
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
  const [orgUsers, setOrgUsers] = useState<any[]>([])

  const fetchOrgUsers = useMemo(() => async () => {
    try {
      const users = await getOrgUserList()
      setOrgUsers(users)
    } catch (error) {
      console.log("Error fetching org user list")
    }
  }, []);

  useEffect(() => {
    fetchOrgUsers()
  }, [fetchOrgUsers])

  // This fires when comments load and associates the Clerk user with the Liveblocks comments
  async function resolveUsers({ userIds }: {
    userIds: string[]
  }): Promise<any> {
    return userIds.map(uid => orgUsers.find(u => u.id === uid) ?? null)
  }

  // This fires when you try to @ someone from within the comment
  async function resolveMentionSuggestions({ text }: {
    text: string
  }): Promise<any> {
    console.log("resolveMentionSuggestions")
    console.log(orgUsers)
    let rv = orgUsers
    if(text) {
      rv = orgUsers.filter(u => u.name.toLowerCase().includes(text.toLowerCase()))
    }
    console.log("rv", rv)
    return rv.map(u => u.id)
  }

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}>
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
          className='border border-slate-200 rounded-lg'
          key={thread.id}
          thread={thread} />
      ))}
      <Composer />
    </div>
  );
}