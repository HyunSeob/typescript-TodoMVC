import Todo  from './Todo';
import Store from './Store';
import View  from './View';

export default class Controller {

  private _view : View;
  private _store: Store;

  constructor() {
    this._view  = new View();
    this._store = new Store();

    this._view.onSubmit((value: string) => {
      const todo: Todo = new Todo(value);
      this._store.insert(todo);
    });

    this._view.onClickCheckbox((targetId: string) => {
      const targetTodo: Todo = this._store.find({ id: targetId })[0];
      targetTodo.toggle();
      this._store.update(targetTodo);
    });

    this._view.onClickButton((targetId: string) => {
      this._store.remove({ id: targetId });
    });

    this._store.subscribe((todos: Array<Todo>) => {
      this._view.render(todos, this._store.count({ done: false }));
    });

    this._store.initialize();
  }
}
