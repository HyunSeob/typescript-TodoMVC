import Todo                     from './Todo';
import { todoListTpl, statTpl } from './templates';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class View {

  private $todoList     : Element;
  private $todoInput    : Element;
  private $todoStat     : Element;
  private _submitHandler: Function;

  constructor() {
    this.$todoList  = document.querySelector('#todo-list');
    this.$todoInput = document.querySelector('#todo-input');
    this.$todoStat  = document.querySelector('#todo-stat');
  }

  onSubmit(handler: Function): void {
    this.$todoInput.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.keyCode === ENTER_KEY) {
        const target: HTMLInputElement = <HTMLInputElement> event.target;
        handler(target.value);
        target.value = '';
      }
    });
  }

  onClickCheckbox(handler: Function): void {
    this.$todoList.addEventListener('click', (event: Event) => {
      const target: HTMLInputElement = <HTMLInputElement> event.target;
      if (target.tagName === 'INPUT' && target.type === 'checkbox') {
        handler(target.parentElement.dataset['id']);
      }
    });
  }

  onClickButton(handler: Function): void {
    this.$todoList.addEventListener('click', (event: Event) => {
      const target: HTMLElement = <HTMLElement> event.target;
      if (target.tagName === 'BUTTON') {
        handler(target.parentElement.dataset['id']);
      }
    });
  }

  render(todos: Array<Todo>, lefts: Number): void {
    this.$todoList.innerHTML = todoListTpl(todos);
    this.$todoStat.innerHTML = statTpl(lefts);
  }
}
