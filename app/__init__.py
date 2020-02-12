from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import ToDo, ToDoList

@app.route('/')
def index():
    return redirect(url_for('get_list_todos', list_id=1))

@app.route('/lists/<list_id>')
def get_list_todos(list_id):
  return render_template('index.html', 
                         lists=ToDoList.query.all(),
                         data=ToDo.query.filter_by(list_id=list_id).order_by('id').all(),
                         active_list=ToDoList.query.get(list_id))
  
@app.route('/lists/create', methods=['POST'])
def create_list():
    error = False
    body = {}
    try:
        listname = request.get_json()['listname']
        listobj = ToDoList(name=listname)
        db.session.add(listobj)
        db.session.commit()
        body['listname'] = listobj.name
        body['listid'] = listobj.id
    except:
        db.session.rollback()
        error=True
#        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)

@app.route('/lists/<list_id>/remove-list', methods=['DELETE'])
def remove_list(list_id):
    try:
        ToDoList.query.filter_by(id=list_id).delete()
        db.session.commit()
        result = {'success': True}
    except:
        db.session.rollback()
        result = {'success': False}
    finally:
        db.session.close()
    return jsonify(result)

@app.route('/todos/create', methods=['POST'])
def create_todo():
    error = False
    body = {}
    try:
        description = request.get_json()['description']
        list_id = request.get_json()['list_id']
        todo = ToDo(description=description, list_id=list_id)
        db.session.add(todo)
        db.session.commit()
        body['description'] = todo.description
    except:
        db.session.rollback()
        error=True
#        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)

@app.route('/todos/<todo_id>/set-completed', methods=['POST'])
def set_completed_todo(todo_id):
    try:
        completed = request.get_json()['completed']
        todo = ToDo.query.get(todo_id)
        todo.completed = completed
        db.session.commit()
        result = {'success': True}
    except:
        db.session.rollback()
        result = {'success': False}
    finally:
        db.session.close()
    return jsonify(result)

@app.route('/todos/<todo_id>/remove-item', methods=['DELETE'])
def remove_todo(todo_id):
    try:
        ToDo.query.filter_by(id=todo_id).delete()
        db.session.commit()
        result = {'success': True}
    except:
        db.session.rollback()
        result = {'success': False}
    finally:
        db.session.close()
    return jsonify(result)

@app.route('/lists/<list_id>/set-completed', methods=['POST'])
def set_completed_list(list_id):
    try:
        ToDo.query.filter_by(list_id=list_id).update({'completed': True}) 
        db.session.commit()
        result = {'success': True}
    except:
        db.session.rollback()
        result = {'success': False}
    finally:
        db.session.close()
    return jsonify(result)