import { LightningElement , track} from 'lwc';

export default class Assignment_5 extends LightningElement {
        // Track newTask input value and tasks array for reactivity in the UI
        @track newTask = ''; // Stores the input value of the new task
        @track tasks = [];   // Array to store all tasks with details
    
        taskId = 1; // Keeps track of the task ID, incremented each time a new task is added
    
        // Handler for updating the newTask variable when the input value changes
        handleInputChange(event) {
            this.newTask = event.target.value; // Captures input value and assigns it to newTask
        }
    
        // Adds a new task to the task list
        addTask() {
            if (this.newTask) { // Ensure the input field is not empty before adding a task
                this.tasks = [
                    ...this.tasks, // Spread operator to include existing tasks
                    {
                        id: this.taskId++, // Unique ID for the task, increments after each addition
                        label: this.newTask, // The task description entered by the user
                        completed: false,    // Task status; initialized as not completed
                        cssClass: ''         // CSS class for styling completed tasks
                    }
                ];
                this.newTask = ''; // Reset the input field after task is added
            }
        }
    
        
        completeTask(event) {
            const taskId = event.currentTarget.dataset.id; // Retrieve task ID from data attribute
            this.tasks = this.tasks.map(task => {          // Map over the tasks array to find the relevant task
                if (task.id == taskId) {                  // If task ID matches, toggle the completion status
                    const isCompleted = !task.completed;  // Toggle completed state
                    return { 
                        ...task, 
                        completed: isCompleted,           // Update completed state
                        cssClass: isCompleted ? 'completed' : '' // Assign CSS class for styling
                    };
                }
                return task; // Return unchanged task if IDs don't match
            });
        }
    
        // Deletes a task from the list
        deleteTask(event) {
            const taskId = event.currentTarget.dataset.id; // Retrieve task ID from data attribute
            this.tasks = this.tasks.filter(task => task.id != taskId); // Filter out the task to delete
        }
    
        // Clears all tasks from the list
        clearAllTasks() {
            this.tasks = []; // Resets the tasks array to empty
        }
    
}