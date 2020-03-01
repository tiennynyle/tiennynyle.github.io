from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
import sys
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='localhost'
db = SQLAlchemy(app)
migrate = Migrate(app,db)

class Todo(db.Model):
    __tablename__= 'todos'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(), nullable = False)
    completed = db.Column(db.Boolean, nullable = False, default=False)
    list_id = db.Column(db.Integer, db.ForeignKey('todolists.id', ondelete='CASCADE'), nullable=False)
    
    def __repr__(self):
        return f'<Todo {self.id} {self.description}>'

class TodoList(db.Model):
    __tablename__ = 'todolists'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(),nullable=False)
    todos = db.relationship('Todo', cascade="all, delete,delete-orphan", backref='list',lazy=True)
    listcompleted = db.Column(db.Boolean, nullable = False, default=False)
    
    def __repr__(self):
        return f'<TodoListItem {self.id} {self.listcompleted} {self.name} >'
db.create_all()

@app.route('/todos/create', methods=['POST'])
def create_todo():
    error = False
    body = {}
    try:
        description = request.get_json()['description']
        list_id = request.get_json()['list_id']
        todo = Todo(description=description)
        active_list = TodoList.query.get(list_id)
        todo.list = active_list
        db.session.add(todo)
        db.session.commit()
        body['description'] = todo.description
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if not error:
        return jsonify(body)
    else:
        abort (500)

@app.route('/todos/<todo_id>', methods = ['DELETE'])
def delete_todo(todo_id):
    try:
        Todo.query.filter_by(id=todo_id).delete()
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return jsonify({ 'success': True })

@app.route('/lists/<list_id>', methods=['DELETE'])
def delete_list(list_id):
    try:
        TodoList.query.filter_by(id=list_id).delete()
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return jsonify({'success': True})

@app.route('/todos/<todo_id>/set-completed', methods=['POST'])
def set_completed_todo(todo_id):
    try: 
        completed = request.get_json()['completed']
        todo = Todo.query.get(todo_id)
        todo.completed = completed
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return redirect(url_for('index'))

@app.route('/lists/<list_id>/set-completed', methods=['POST'])
def set_completed_list(list_id):
    try:
        completed = request.get_json()['list-completed']
        todolist = TodoList.query.get(list_id)
        todos = Todo.query.filter_by(list_id=list_id)
        for todo in todos:
            todo.completed = completed
        todolist.listcompleted = completed
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return redirect(url_for('get_all_lists'))

@app.route('/lists/createlists/', methods=['POST'])
def create_lists():
    error = False
    body = {}
    try:
        listDescription = request.get_json()['listDescription']
        print ('it hits here '+ listDescription)
        newlist = TodoList(name=listDescription)
        db.session.add(newlist)
        db.session.commit()
        body['listDescription'] = newlist.name
        body['id'] = newlist.id
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if not error:
        return jsonify(body)
    else:
        abort (400)

@app.route('/lists/<list_id>')
def get_list_todos(list_id):

    active_list = TodoList.query.get(list_id)
    if (active_list == None):
        return ("List not found")
    return render_template('index.html', 
    lists=TodoList.query.all(),
    active_list=TodoList.query.get(list_id),
    todos=Todo.query.filter_by(list_id=list_id).order_by('id').all()
    )

@app.route('/lists/')
def get_all_lists():
    return render_template('homepage.html', 
    lists=TodoList.query.all()) 

@app.route('/')
def index():
    return redirect(url_for('get_all_lists'))
if __name__ == "__main__":
    app.run(port=5000)
