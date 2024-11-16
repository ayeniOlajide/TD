import express, { Request, Response } from 'express';

const tasks: { id: number; title: string; completed: boolean }[] = [];

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send("Hello, your robot is ready");
});

// Route to create a new task
app.post('/tasks', (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: "The task title is required" });
    }

    const newTask = {
        id: tasks.length + 1, // Generate a unique ID
        title,
        completed: false, // New tasks are incomplete by default
    };

    tasks.push(newTask); // Add the new task
    res.status(201).json(newTask); // Respond with the new task
});

// Route to get all tasks
app.get('/tasks', (req: Request, res: Response) => {
    res.json(tasks); // Send the list of tasks
});

// Route to get a single task by ID
app.get('/tasks/:id', (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: "Task not found." });
    }

    res.json(task); // Send the specific task
});

// Route to update a task
app.put('/tasks/:id', (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
        return res.status(404).json({ message: "Task not found." });
    }

    // Update the task properties if provided
    if (title) task.title = title;
    if (completed !== undefined) task.completed = completed;

    res.json(task); // Respond with the updated task
});

// Route to delete a task
app.delete('/tasks/:id', (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found." });
    }

    tasks.splice(taskIndex, 1); // Remove the task from the list
    res.status(204).send(); // Respond with no content
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
