System.register("helpers", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function token() {
        return Math.floor((Math.random() + 1) * 0x10000)
            .toString(16)
            .substring(1);
    }
    function guid() {
        return [
            token() + token(),
            token(),
            token(),
            token(),
            token() + token()
        ].join('-');
    }
    exports_1("guid", guid);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("Todo", ["helpers"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var helpers_1;
    var Todo;
    return {
        setters:[
            function (helpers_1_1) {
                helpers_1 = helpers_1_1;
            }],
        execute: function() {
            Todo = (function () {
                function Todo(_todo) {
                    if (typeof _todo === 'string') {
                        this._id = helpers_1.guid();
                        this._content = _todo;
                        this._done = false;
                    }
                    else {
                        this._id = _todo._id;
                        this._content = _todo._content;
                        this._done = _todo._done;
                    }
                }
                Object.defineProperty(Todo.prototype, "id", {
                    get: function () { return this._id; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Todo.prototype, "content", {
                    get: function () { return this._content; },
                    set: function (_content) { this._content = _content; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Todo.prototype, "done", {
                    get: function () { return this._done; },
                    enumerable: true,
                    configurable: true
                });
                Todo.prototype.equal = function (_todo) { return this._id === _todo.id; };
                Todo.prototype.toggle = function () { return this._done = !this._done; };
                return Todo;
            }());
            exports_2("default", Todo);
        }
    }
});
System.register("Store", ["Todo"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Todo_1;
    var Store;
    return {
        setters:[
            function (Todo_1_1) {
                Todo_1 = Todo_1_1;
            }],
        execute: function() {
            Store = (function () {
                function Store() {
                    this._localStorage = window.localStorage;
                    this._subscribers = [];
                }
                Store.prototype._getStorage = function () {
                    return this._todos = this._todos || JSON.parse(this._localStorage.getItem('TodoList')).map(function (item) { return new Todo_1.default(item); }) || [];
                };
                Store.prototype._setStorage = function (todos) {
                    this._localStorage.setItem('TodoList', JSON.stringify(todos));
                    this._publish();
                };
                Store.prototype.initialize = function () {
                    this._getStorage();
                    this._publish();
                    return this;
                };
                Store.prototype.insert = function (todo) {
                    this._setStorage(this._todos = this._getStorage().concat([todo]));
                };
                Store.prototype.find = function (query) {
                    return this._getStorage().filter(function (todo) {
                        for (var key in query) {
                            if (todo[key] !== query[key]) {
                                return false;
                            }
                        }
                        return true;
                    });
                };
                Store.prototype.update = function (patch) {
                    this._setStorage(this._getStorage().map(function (target) {
                        if (target.equal(patch)) {
                            target = patch;
                        }
                        return target;
                    }));
                };
                Store.prototype.remove = function (query) {
                    this._setStorage(this._todos = this._getStorage()
                        .filter(function (todo) {
                        for (var key in query) {
                            if (todo[key] !== query[key]) {
                                return true;
                            }
                        }
                        return false;
                    }));
                };
                Store.prototype.count = function (query) {
                    return this._getStorage().filter(function (todo) {
                        for (var key in query) {
                            if (todo[key] !== query[key]) {
                                return false;
                            }
                        }
                        return true;
                    }).length;
                };
                Store.prototype.subscribe = function (subscriber) {
                    this._subscribers.push(subscriber);
                };
                Store.prototype._publish = function () {
                    var _this = this;
                    this._subscribers.forEach(function (s) { return s(_this._getStorage()); });
                };
                return Store;
            }());
            exports_3("default", Store);
        }
    }
});
System.register("templates", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function todoTpl(todo) {
        return [
            ("<li data-id=\"" + todo.id + "\">"),
            ("<input type=\"checkbox\" " + (todo.done ? 'checked' : '') + " />"),
            ("<label " + (todo.done ? 'style="text-decoration: line-through"' : '') + ">" + todo.content + "</label>"),
            "<button>X</button>",
            "</li>"
        ].join('');
    }
    exports_4("todoTpl", todoTpl);
    function todoListTpl(todos) {
        return todos.map(function (t) { return todoTpl(t); }).join('');
    }
    exports_4("todoListTpl", todoListTpl);
    function statTpl(leftTodos) {
        return leftTodos + " item" + (leftTodos === 1 ? '' : 's') + " left.";
    }
    exports_4("statTpl", statTpl);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("View", ["templates"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var templates_1;
    var ENTER_KEY, ESCAPE_KEY, View;
    return {
        setters:[
            function (templates_1_1) {
                templates_1 = templates_1_1;
            }],
        execute: function() {
            ENTER_KEY = 13;
            ESCAPE_KEY = 27;
            View = (function () {
                function View() {
                    this.$todoList = document.querySelector('#todo-list');
                    this.$todoInput = document.querySelector('#todo-input');
                    this.$todoStat = document.querySelector('#todo-stat');
                }
                View.prototype.onSubmit = function (handler) {
                    this.$todoInput.addEventListener('keypress', function (event) {
                        if (event.keyCode === ENTER_KEY) {
                            var target = event.target;
                            handler(target.value);
                            target.value = '';
                        }
                    });
                };
                View.prototype.onClickCheckbox = function (handler) {
                    this.$todoList.addEventListener('click', function (event) {
                        var target = event.target;
                        if (target.tagName === 'INPUT' && target.type === 'checkbox') {
                            handler(target.parentElement.dataset['id']);
                        }
                    });
                };
                View.prototype.onClickButton = function (handler) {
                    this.$todoList.addEventListener('click', function (event) {
                        var target = event.target;
                        if (target.tagName === 'BUTTON') {
                            handler(target.parentElement.dataset['id']);
                        }
                    });
                };
                View.prototype.render = function (todos, lefts) {
                    this.$todoList.innerHTML = templates_1.todoListTpl(todos);
                    this.$todoStat.innerHTML = templates_1.statTpl(lefts);
                };
                return View;
            }());
            exports_5("default", View);
        }
    }
});
System.register("Controller", ["Todo", "Store", "View"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var Todo_2, Store_1, View_1;
    var Controller;
    return {
        setters:[
            function (Todo_2_1) {
                Todo_2 = Todo_2_1;
            },
            function (Store_1_1) {
                Store_1 = Store_1_1;
            },
            function (View_1_1) {
                View_1 = View_1_1;
            }],
        execute: function() {
            Controller = (function () {
                function Controller() {
                    var _this = this;
                    this._view = new View_1.default();
                    this._store = new Store_1.default();
                    this._view.onSubmit(function (value) {
                        var todo = new Todo_2.default(value);
                        _this._store.insert(todo);
                    });
                    this._view.onClickCheckbox(function (targetId) {
                        var targetTodo = _this._store.find({ id: targetId })[0];
                        targetTodo.toggle();
                        _this._store.update(targetTodo);
                    });
                    this._view.onClickButton(function (targetId) {
                        _this._store.remove({ id: targetId });
                    });
                    this._store.subscribe(function (todos) {
                        _this._view.render(todos, _this._store.count({ done: false }));
                    });
                    this._store.initialize();
                }
                return Controller;
            }());
            exports_6("default", Controller);
        }
    }
});
System.register("app", ["Controller"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Controller_1;
    var controller;
    return {
        setters:[
            function (Controller_1_1) {
                Controller_1 = Controller_1_1;
            }],
        execute: function() {
            controller = new Controller_1.default();
        }
    }
});
//# sourceMappingURL=bundle.js.map