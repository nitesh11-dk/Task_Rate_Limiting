### Documentation:

#### Overview:
This application implements rate limiting and task queueing for an Express-based API. Each user can send tasks, but their requests are limited based on a rate of 1 task per second and 20 tasks per minute. If the rate limit is exceeded, the task is queued and processed when possible.

#### Assumptions:
- **Rate Limits**: The limits are set to 1 task per second and 20 tasks per minute.
- **Task Logging**: Each task completion is logged in a text file (`task_log.txt`), and this is handled asynchronously.
- **Task Queue**: The task queue uses a simple approach to check and process tasks at a 1-second interval.

#### Approach:
1. **Rate Limit Check**: Each request checks whether the user has exceeded the rate limit by tracking the timestamps of previous tasks in `userTasks`.
2. **Task Queue**: If the rate limit is exceeded, the task is queued. A separate function processes the tasks in the queue at a 1-second interval.
3. **Task Execution**: When a task is ready to be executed, it's logged, and an asynchronous task is processed.

#### Edge Cases Handled:
- **Missing User ID**: The API returns an error if no user ID is provided.
- **Multiple Requests**: Requests are handled based on the user’s rate limit, and tasks are queued or processed accordingly.
- **File Write Errors**: The file write for logging is done asynchronously, and errors are logged to the console if any occur.

---

### To Submit:
- **Source Code**: Include the updated JavaScript code in a `.js` file.
- **Configuration Files**: If you have a `package.json` or any related config files, include those as well.
- **Documentation**: A brief explanation of the approach, assumptions, and how the rate limiting and queueing mechanism works.
