import React, { Component } from 'react'
import request from 'superagent';

export default class Todo extends Component {
    state = {
        todos: [],
        todoName: '',
        loading: false
    }

    componentDidMount = async () => {
        await this.fetchTodo()
    }

    fetchTodo = async () => {
        const { token } = this.props;

        await this.setState({ loading: true });
        const response = await request.get('https://evening-beyond-08822.herokuapp.com/api/todo')
            .set('Authorization', token)

        await this.setState({ todos: response.body, loading: false })
    }

    handleSubmit = async (e) => {
        const { todoName } = this.state;
        const { token } = this.props;

        e.preventDefault();

        const newTodo = {
            todo: todoName,
        };

        await this.setState({ loading: true });

        await request.post('https://evening-beyond-08822.herokuapp.com/api/todo')
            .send(newTodo)
            .set('Authorization', token);

        await this.fetchTodo();
    }

    handleCompleteClick = async (someId) => {
        const { token } = this.props;

        await request.put(`https://evening-beyond-08822.herokuapp.com/api/todo/${someId}`)
            .set('Authorization', token);

        await this.fetchTodo();
    }

    render() {
        const {
            todoName,
            loading,
            todos,
        } = this.state;

        return (
            <div>
                Welcome to you to do list!
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Add a chore:
                        <input
                            value={todoName}
                            onChange={(e) => this.setState({ todoName: e.target.value })}
                        />
                    </label>

                    <button>
                        Add chore
                        </button>
                </form>
                {
                    loading
                        ? 'LOADING!!!!!'
                        : todos.map(todo => <div key={`${todo.todo}${todo.id}${Math.random()}`} style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }
                        }>
                            Task: {todo.todo}
                            {
                                todo.completed ? '' : <button
                                    onClick={() => this.handleCompleteClick(todo.id)}>
                                    Finished
                            </button>
                            }
                        </div>)
                }
            </div>
        )
    }
}