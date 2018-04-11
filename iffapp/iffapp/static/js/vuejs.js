vm = new Vue({
  delimiters: ['${', '}$'],
  el: '#app',
  data: {
    add_text: 'Add new ifflist ',
    add_btn: 'add',
    del_msg: '',
    ifflists_all: [],  // not used atm, but might come in handy eventually
    ifflists_current: [],
    ifflists_completed: [],
    todos_all: [],  // all the todos for everyone
    loading: false,  // pretty loading spinner thingie
    displayedIfflist: {},  // holds the currently displayed ifflist
    displayedIfflistID: '',
    displayedTodos: [],  // so the right todos are populated
    new_todos: [],  // array of todos from inputs to be saved
    ifflist: [],  // for editing ifflist get-to-dos
    todo: [],  // for editing ifflist to-dos
  },
  http: {
    root: 'http://localhost:8000',
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  },
  mounted: function () {
    this.getInitialTodos(); // get todos first, or else ifflists are not populated with todos
  },
  methods: {
    getInitialTodos: function () {  // gets all the todos, regardless of user, and launches getIfflists
      this.loading = true;
      this.$http.get('api/todoitems/')
          .then((response) => {
            this.todos_all = response.body;
            this.todos_all.sort((x,y) => x.id > y.id);  // sort by id number so the oldest is on top
            this.getIfflists();  // get ifflists only after todos have been gotten
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    getAllTodos: function () {  // gets all the todos, regardless of user
      this.loading = true;
      this.$http.get('api/todoitems/')
          .then((response) => {
            this.todos_all = response.body;
            this.todos_all.sort((x,y) => x.id > y.id);  // sort by id number so the oldest is on top
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    getIfflists: function () {  // gets all the ifflists for the logged-in user
      this.loading = true;
      this.$http.get('api/')
          .then((response) => {
            this.ifflists_all = response.body;
            for (let i = 0; i < response.body.length; i++) {
              if (response.body[i].is_completed === false) {
                this.ifflists_current.push(response.body[i]);
              } else {
                this.ifflists_completed.push(response.body[i]);
              }
            }
            this.ifflists_current.sort((x,y) => x.id < y.id);  // sort by id number so the newest is on top
            this.ifflists_completed.sort((x,y) => x.id < y.id);  // sort by id number so the newest is on top
            this.loadStarter(this.ifflists_current[0]);
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    loadStarter: function (starter) {  // loads the newest current ifflist as the starter list on page load
      this.displayedIfflist = starter;
      console.log(this.displayedIfflist.id);
      this.getTodos(starter.id);
    },
    getIfflist: function (id) {  // loads list on click
      console.log("getting ifflist");
      if (document.querySelector('.add_todo_field')) {  // otherwise error when no fields made
        let add_todo_field = document.querySelectorAll('.add_todo_field');
        add_todo_field.classList.add('hidden');
      }
      this.loading = true;
      this.$http.get(`/api/${id}/`)
          .then((response) => {
            this.displayedIfflist = response.body;
            console.log(id);
            this.getTodos(id);
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    getTodos: function (id) {  // get the todos for the displayed ifflist
      console.log("Getting todos for ifflist with ID: " + id);
      this.displayedTodos = [];  // clear or else it just adds on todos to the wrong ifflist
      for (let i = 0; i < this.todos_all.length; i++) {
        if (this.todos_all[i].ifflist === id) {
          this.displayedTodos.push(this.todos_all[i]);
        }
      }
    },
    createAdd: function () {  // allows adding additional todoitems to existing ifflist
      this.new_todos.push({value: ''});  // makes a new li for adding todoitems
    },
    showAddIfflist: function () {  // toggles add/display views
      let add_ifflist_div = document.querySelector('#add_ifflist_div');
      add_ifflist_div.classList.toggle('hidden');
      let current_ifflist_div = document.querySelector('#current_ifflist_div');
      current_ifflist_div.classList.toggle('hidden');
      if (this.add_btn === 'add') {
        this.add_btn = 'arrow_back';
        this.add_text = 'Back to my ifflists';
      } else {
        this.add_btn = 'add';
        this.add_text = 'Add new ifflist ';
      }
    },
    addTodo: function (value) {  // adds only the todoitem next to the save button that was clicked
      console.log("adding todo");
      let new_todo_item_value = value;
      console.log(new_todo_item_value);
      this.new_todos = this.new_todos.filter(obj => obj.value !== value);  // remove any todoitems that are being saved
      // but save the rest
      newTodo = {'text': new_todo_item_value, 'ifflist': this.displayedIfflist.id, 'is_completed': false};
      console.log(newTodo.ifflist);
      let csrf_token = Cookies.get('csrftoken');
      this.$http.post('/api/todoitems/', newTodo, {headers: {'X-CSRFToken': csrf_token}})
          .then((response) => {
            this.loading = false;
            this.getAllTodos();
            this.getIfflist(newTodo.ifflist);  // to get the right list, not the newest one
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    updateTodo: function (value) {  // updates only the todoitem next to the save button that was clicked
      console.log("updating todo");
      let new_todo_item_value = value;
      console.log(new_todo_item_value);
      this.new_todos = this.new_todos.filter(obj => obj.value !== value);  // remove any todoitems that are being saved
      // but save the rest
      newTodo = {'text': new_todo_item_value, 'ifflist': this.displayedIfflist.id, 'is_completed': false};
      console.log(newTodo.ifflist);
      let csrf_token = Cookies.get('csrftoken');
      this.$http.post('/api/todoitems/', newTodo, {headers: {'X-CSRFToken': csrf_token}})
          .then((response) => {
            this.loading = false;
            this.getAllTodos();
            this.getIfflist(newTodo.ifflist);  // to get the right list, not the newest one
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    deleteTodo: function (value) {  // deletes only the todoitem next to the save button that was clicked
      console.log("deleting todo");
      let new_todo_item_value = value;
      console.log(new_todo_item_value);
      this.new_todos = this.new_todos.filter(obj => obj.value !== value);  // remove any todoitems that are being saved
      // but save the rest
      newTodo = {'text': new_todo_item_value, 'ifflist': this.displayedIfflist.id, 'is_completed': false};
      console.log(newTodo.ifflist);
      let csrf_token = Cookies.get('csrftoken');
      this.$http.post('/api/todoitems/', newTodo, {headers: {'X-CSRFToken': csrf_token}})
          .then((response) => {
            this.loading = false;
            this.getAllTodos();
            this.getIfflist(newTodo.ifflist);  // to get the right list, not the newest one
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    addIfflist: function () {
      this.loading = true;
      let new_get_to_do = document.querySelector('#new_get_to_do').value;
      console.log(new_get_to_do);
      let user = user_id;
      let newIfflist = {'get_to_do': new_get_to_do, 'user': user};
      console.log(newIfflist);
      let csrf_token = Cookies.get('csrftoken');
      this.$http.post('/api/', newIfflist, {headers: {'X-CSRFToken': csrf_token}})
          .then((response) => {
            this.loading = false;
            this.getIfflists(); // to reload the page after save
            this.showAddIfflist(); // back to list view
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    editGTD: function () {  // toggle edit and save buttons
      let ifflist_item = document.querySelector('#ifflist_item');
      ifflist_item.classList.toggle('hidden');
      let edit_ifflist_item = document.querySelector('#edit_ifflist_item');
      edit_ifflist_item.classList.toggle('hidden');
      let edit_bt_gtd = document.querySelector('#edit_bt_gtd');
      edit_bt_gtd.classList.toggle('hidden');
      let save_bt_gtd = document.querySelector('#save_bt_gtd');
      save_bt_gtd.classList.toggle('hidden');
    },
    updateIfflist: function (value, id) {  // update ifflist get-to-do
      console.log("updating");
      this.editGTD();  // to toggle visible
      this.loading = true;
      let user = user_id;
      console.log("value: " + value + ", id: " + id);
      let csrf_token = Cookies.get('csrftoken');
      this.$http.put(`/api/${id}/`, {'get_to_do': value, 'user': user}, {headers: {'X-CSRFToken': csrf_token}})
          .then((response) => {
            this.loading = false;
            this.getIfflists(); // to reload the page after save
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    deleteIfflist: function (id) {  // delete entire ifflist
      this.del_msg = 'Deleting ifflist...';
      console.log("deleting");
      console.log("id: " + id);
      this.loading = true;
      let csrf_token = Cookies.get('csrftoken');
      this.$http.delete(`/api/${id}/`, {headers: {'X-CSRFToken': csrf_token}})
          .then((response) => {
            this.loading = false;
            this.getIfflists();  // to refresh the lists after save
            location.reload();   // force a reload
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
    },
    completeTodo: function (id) {

    },
    completeIfflist: function (id) {

    },
  },
  computed: {},
  watch: {},

});
