import Todo from './Todo';

export function todoTpl(todo: Todo): string {
  return [
    `<li data-id="${todo.id}">`,
    `<input type="checkbox" ${todo.done ? 'checked' : ''} />`,
    `<label ${todo.done ? 'style="text-decoration: line-through"' : ''}>${todo.content}</label>`,
    `<button>X</button>`,
    `</li>`
  ].join('');
}

export function todoListTpl(todos: Array<Todo>): string {
  return todos.map((t: Todo) => todoTpl(t)).join('');
}

export function statTpl(leftTodos: Number): string {
  return `${leftTodos} item${leftTodos === 1 ? '' : 's'} left.`;
}
