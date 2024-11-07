    import express from 'express';
    import fs from 'fs';
    const app = express();
    app.use(express.json());

    const rateLimits = {
    perSecond: 1,  
    perMinute: 20,
    };

    const userTasks = {};  

    async function task(user_id) {
        const logEntry = `${user_id} - task completed at - ${new Date().toISOString()}\n`;
        fs.appendFile('task_log.txt', logEntry, (err) => {
            if (err) console.error('Error writing to log:', err);
        });
        console.log(logEntry);
    }

    function isRateLimitExceeded(user_id) {
        const now = Date.now();
        const userData = userTasks[user_id] || { tasks: [], timestamps: [] };

    
        userData.timestamps = userData.timestamps.filter((time) => now - time < 60000);

        if (userData.timestamps.length >= rateLimits.perMinute) {
            return true; 
        }

    
        if (userData.timestamps.length > 0 && now - userData.timestamps[userData.timestamps.length - 1] < 1000) {
            return true; 
        }

        return false;
    }

    function addTaskToQueue(user_id) {
        if (!userTasks[user_id]) {
            userTasks[user_id] = { tasks: [], timestamps: [] };
        }

        // Add the task to the queue
        userTasks[user_id].tasks.push(async () => await task(user_id));
        processQueue(user_id); 
    }

    function processQueue(user_id) {
        const interval = setInterval(() => {
            if (userTasks[user_id].tasks.length === 0) {
                clearInterval(interval); 
                return;
            }
            
            
            if (!isRateLimitExceeded(user_id)) {
                const userTask = userTasks[user_id].tasks.shift(); // Get the task
                userTasks[user_id].timestamps.push(Date.now()); 
                userTask(); k
            }
        }, 1000); 
    }

    app.post('/task', (req, res) => {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (isRateLimitExceeded(user_id)) {
        
            addTaskToQueue(user_id);  
            res.status(429).json({ message: 'Rate limit exceeded, task queued' });
        } else {
            
            addTaskToQueue(user_id);
            res.status(200).json({ message: 'Task is being processed' });
        }
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
