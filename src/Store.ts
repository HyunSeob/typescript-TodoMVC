import Todo from './Todo';

export default class Store {

  private _localStorage: Storage;
  private _todos       : Array<Todo>;
  private _subscribers : Array<Function>;

  constructor() {
    this._localStorage = window.localStorage;
    this._subscribers = [];
  }

  private _getStorage(): Array<Todo> {
    return this._todos = this._todos || (JSON.parse(
      this._localStorage.getItem('TodoList')
    ) || []).map((item: Object) => new Todo(item));
  }

  private _setStorage(todos: Array<Todo>): void {
    this._localStorage.setItem(
      'TodoList',
      JSON.stringify(todos)
    );
    this._publish();
  }

  initialize(): Store {
    this._getStorage();
    this._publish();
    return this;
  }

  insert(todo: Todo): void {
    this._setStorage(
      this._todos = this._getStorage().concat([ todo ])
    );
  }

  find(query: any): Array<Todo> {
    return this._getStorage().filter((todo: Todo) => {
      for (let key in query) {
        if (todo[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  update(patch: Todo): void {
    this._setStorage(
      this._getStorage().map((target: Todo) => {
        if (target.equal(patch)) {
          target = patch;
        }
        return target;
      })
    );
  }

  remove(query: any): void {
    this._setStorage(
      this._todos = this._getStorage()
      .filter((todo: Todo) => {
        for (let key in query) {
          if (todo[key] !== query[key]) {
            return true;
          }
        }
        return false;
      })
    );
  }

  count(query: any): Number {
    return this._getStorage().filter((todo: Todo) => {
      for (let key in query) {
        if (todo[key] !== query[key]) {
          return false;
        }
      }
      return true;
    }).length;
  }

  subscribe(subscriber: Function): void {
    this._subscribers.push(subscriber);
  }

  private _publish(): void {
    this._subscribers.forEach(s => s(this._getStorage()));
  }
}
