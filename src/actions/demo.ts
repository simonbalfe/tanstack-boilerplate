import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/src/services/better-auth/auth'

// Simulated data store (in a real app, this would be a database)
const todoStore: Array<{ id: string; text: string; completed: boolean; createdAt: Date }> = [
  { id: '1', text: 'Learn TanStack Router', completed: true, createdAt: new Date('2024-01-01') },
  { id: '2', text: 'Build a demo app', completed: false, createdAt: new Date('2024-01-02') },
  { id: '3', text: 'Deploy to production', completed: false, createdAt: new Date('2024-01-03') },
]

// GET: Fetch all todos - demonstrates server-side data fetching
export const getTodos = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    return { success: false, error: 'Unauthorized', todos: [] }
  }

  // Simulate network delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    todos: todoStore.map((todo) => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
    })),
  }
})

// POST: Add a new todo - demonstrates form submission with validation
export const addTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: { text: string }) => {
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('Todo text is required')
    }
    if (data.text.length > 200) {
      throw new Error('Todo text must be less than 200 characters')
    }
    return data
  })
  .handler(async ({ data }) => {
    const request = getRequest()

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newTodo = {
      id: crypto.randomUUID(),
      text: data.text.trim(),
      completed: false,
      createdAt: new Date(),
    }

    todoStore.push(newTodo)

    return {
      success: true,
      todo: {
        ...newTodo,
        createdAt: newTodo.createdAt.toISOString(),
      },
    }
  })

// POST: Toggle todo completion - demonstrates updating data
export const toggleTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const request = getRequest()

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const todo = todoStore.find((t) => t.id === data.id)
    if (!todo) {
      return { success: false, error: 'Todo not found' }
    }

    todo.completed = !todo.completed

    return {
      success: true,
      todo: {
        ...todo,
        createdAt: todo.createdAt.toISOString(),
      },
    }
  })

// POST: Delete a todo - demonstrates deletion
export const deleteTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const request = getRequest()

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const index = todoStore.findIndex((t) => t.id === data.id)
    if (index === -1) {
      return { success: false, error: 'Todo not found' }
    }

    todoStore.splice(index, 1)

    return { success: true }
  })

// GET: Fetch server info - demonstrates simple data fetching
export const getServerInfo = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  return {
    serverTime: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? 'Unknown',
    isAuthenticated: !!session?.user,
    userName: session?.user?.name ?? null,
  }
})
