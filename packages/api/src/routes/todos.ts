import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { createTodo, deleteTodo, listTodos, toggleTodo } from '../services/todos'

export const todoRoutes = new Hono()

todoRoutes.get('/todos', requireAuth, async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return c.json({ success: true, todos: listTodos() })
})

todoRoutes.post('/todos', requireAuth, async (c) => {
  const body = await c.req.json()
  const text = body?.text

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return c.json({ success: false, error: 'Todo text is required' }, 400)
  }

  if (text.length > 200) {
    return c.json({ success: false, error: 'Todo text must be less than 200 characters' }, 400)
  }

  await new Promise((resolve) => setTimeout(resolve, 300))
  return c.json({ success: true, todo: createTodo(text) })
})

todoRoutes.post('/todos/delete', requireAuth, async (c) => {
  const body = await c.req.json()
  const id = body?.id

  if (!id || typeof id !== 'string') {
    return c.json({ success: false, error: 'Todo ID is required' }, 400)
  }

  const deleted = deleteTodo(id)
  if (!deleted) {
    return c.json({ success: false, error: 'Todo not found' }, 404)
  }

  return c.json({ success: true })
})

todoRoutes.post('/todos/toggle', requireAuth, async (c) => {
  const body = await c.req.json()
  const id = body?.id

  if (!id || typeof id !== 'string') {
    return c.json({ success: false, error: 'Todo ID is required' }, 400)
  }

  const todo = toggleTodo(id)
  if (!todo) {
    return c.json({ success: false, error: 'Todo not found' }, 404)
  }

  return c.json({ success: true, todo })
})
