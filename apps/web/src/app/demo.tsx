import { useUser } from '@shared/hooks/use-user'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Badge } from '@ui/components/badge'
import { Button } from '@ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/components/card'
import { Input } from '@ui/components/input'
import { Separator } from '@ui/components/separator'
import { Skeleton } from '@ui/components/skeleton'
import {
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  Server,
  Trash2,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

type ServerInfo = {
  serverTime: string
  userAgent: string
  isAuthenticated: boolean
  userName: string | null
}

function DemoPage() {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [serverInfoLoading, setServerInfoLoading] = useState(true)

  const [todos, setTodos] = useState<Todo[]>([])
  const [todosLoading, setTodosLoading] = useState(true)
  const [newTodoText, setNewTodoText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: '/auth' })
    }
  }, [user, loading, navigate])

  const fetchServerInfo = async () => {
    setServerInfoLoading(true)
    try {
      const res = await fetch('/api/server-info')
      const info = await res.json()
      setServerInfo(info)
    } catch {
      toast.error('Failed to fetch server info')
    } finally {
      setServerInfoLoading(false)
    }
  }

  const fetchTodos = async () => {
    setTodosLoading(true)
    try {
      const res = await fetch('/api/todos')
      const result = await res.json()
      if (result.success) {
        setTodos(result.todos)
      } else {
        toast.error(result.error ?? 'Failed to fetch todos')
      }
    } catch {
      toast.error('Failed to fetch todos')
    } finally {
      setTodosLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      void fetchServerInfo()
      void fetchTodos()
    }
  }, [user])

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoText.trim() || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodoText }),
      })
      const result = await res.json()
      if (result.success && result.todo) {
        setTodos((prev) => [...prev, result.todo])
        setNewTodoText('')
        toast.success('Todo added successfully!')
      } else {
        toast.error(result.error ?? 'Failed to add todo')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add todo')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleTodo = async (id: string) => {
    setTogglingId(id)
    try {
      const res = await fetch('/api/todos/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await res.json()
      if (result.success && result.todo) {
        setTodos((prev) => prev.map((t) => (t.id === id ? result.todo : t)))
        toast.success(result.todo.completed ? 'Todo completed!' : 'Todo uncompleted')
      } else {
        toast.error(result.error ?? 'Failed to toggle todo')
      }
    } catch {
      toast.error('Failed to toggle todo')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch('/api/todos/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await res.json()
      if (result.success) {
        setTodos((prev) => prev.filter((t) => t.id !== id))
        toast.success('Todo deleted!')
      } else {
        toast.error(result.error ?? 'Failed to delete todo')
      }
    } catch {
      toast.error('Failed to delete todo')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">TanStack Demo</h1>
          <p className="text-muted-foreground">
            Demonstrating API routes, data fetching, and form submissions
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Server Information
              </CardTitle>
              <CardDescription>Data fetched from the server using a GET API route</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchServerInfo}
              disabled={serverInfoLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${serverInfoLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {serverInfoLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : serverInfo ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Server Time</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(serverInfo.serverTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Authenticated User</p>
                    <p className="text-sm text-muted-foreground">
                      {serverInfo.userName ?? 'Not authenticated'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">User Agent</p>
                    <p className="text-sm text-muted-foreground truncate">{serverInfo.userAgent}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Todo List
                </CardTitle>
                <CardDescription>Create, update, and delete items using API routes</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchTodos} disabled={todosLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${todosLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                placeholder="Add a new todo..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                disabled={submitting}
                maxLength={200}
              />
              <Button type="submit" disabled={submitting || !newTodoText.trim()}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">Add</span>
              </Button>
            </form>

            <Separator />

            {todosLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No todos yet. Add one above!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleToggleTodo(todo.id)}
                      disabled={togglingId === todo.id}
                    >
                      {togglingId === todo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : todo.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <span
                      className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {todo.text}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={deletingId === todo.id}
                    >
                      {deletingId === todo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {todos.length > 0 && (
              <>
                <Separator />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{todos.filter((t) => !t.completed).length} items remaining</span>
                  <span>{todos.filter((t) => t.completed).length} completed</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">API Routes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    File-based API routes with{' '}
                    <code className="text-xs bg-muted px-1 rounded">server.handlers</code>
                  </li>
                  <li>JSON request/response with validation</li>
                  <li>Session authentication on every request</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Client Integration</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    Standard <code className="text-xs bg-muted px-1 rounded">fetch()</code> API
                    calls
                  </li>
                  <li>JSON serialization/deserialization</li>
                  <li>Loading states and error handling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
