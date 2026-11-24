/**
 * One shared requestAnimationFrame loop for every cosmetic pointer effect (the cursor ring, the
 * neural background). A task runs while it returns `true` and drops out as soon as it returns
 * `false`, and the loop itself stops when no task is left, so a quiet page runs no frames at all.
 */
export type Task = (dt: number) => boolean

const tasks = new Set<Task>()
let frame = 0
let last = 0

function loop(now: number) {
  // The time step must stay within [0, 0.05]. The upper cap stops a backgrounded tab or a long
  // frame from causing a jump. The LOWER bound matters just as much: a frame timestamp can be
  // earlier than the `performance.now()` taken when an event woke the loop, which gives a negative
  // step, and the smoothing used by tasks (`1 - exp(-dt * rate)`) then explodes instead of easing.
  const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05)
  last = now

  for (const task of [...tasks]) {
    try {
      if (!task(dt)) tasks.delete(task)
    } catch (error) {
      // A failing effect is dropped, so it can never stall the loop for the others.
      tasks.delete(task)
      console.error(error)
    }
  }
  frame = tasks.size > 0 ? requestAnimationFrame(loop) : 0
}

/** Starts (or keeps) a task running. Safe to call on every event. */
export function wake(task: Task) {
  tasks.add(task)
  if (!frame) {
    last = performance.now()
    frame = requestAnimationFrame(loop)
  }
}

/** Removes a task immediately (for cleanup). */
export function cancel(task: Task) {
  tasks.delete(task)
}
