import { guid } from './helpers';

export default class Todo {

  [index: string]: any; /** Indexible */

  private _id     : string;
  private _content: string;
  private _done   : boolean;

  constructor(_todo: string | any) {
    if (typeof _todo === 'string') {
      this._id      = guid();
      this._content = _todo;
      this._done    = false;
    } else {
      this._id      = _todo._id;
      this._content = _todo._content;
      this._done    = _todo._done;
    }
  }

  get id     (): string  { return this._id; }
  get content(): string  { return this._content; }
  get done   (): boolean { return this._done; }

  set content(_content: string) { this._content = _content; }

  equal(_todo: Todo): boolean { return this._id === _todo.id; }

  toggle(): boolean { return this._done = !this._done; }

}
