import { getOneTask } from "@/app/actions";
import { useSession } from "@clerk/nextjs";
import { auth, currentUser } from '@clerk/nextjs/server'
import { Liveblocks } from "@liveblocks/node";

export async function POST(req: Request) {
  const { sessionClaims } = auth()
  if(!sessionClaims) {
    return new Response("Not authorized", { status: 401 })
  }

  const user = await currentUser()
  if(!user) {
    return new Response("Not authorized", { status: 401 })
  }

  // 'room' = 'room_${taskId}'
  const { room } = await req.json()

  // Parse the task ID from the request
  const taskId = room.split("_")[1]
  const [task] = await getOneTask(+taskId)
  if(!task) {
    return new Response("Not authorized", { status: 401 })
  }

  // If the task was not created by the user or within the organization, send back a 401
  if(task.owner_id !== user.id && task.owner_id !== sessionClaims?.org_id) {
    return new Response("Not authorized", { status: 401 })
  }

  // All security checks passed so create the session
  const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
  });
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName,
      avatar: user.imageUrl
    }
  });

  session.allow(room, session.FULL_ACCESS)
  const { body, status } = await session.authorize()

  return new Response(body, { status })
}