import React, { Component, createRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default class Home extends Component {
  state = {
    todoList: [],
    filterType: 'all',
  };

  inputRef = createRef();

  async componentDidMount() {
    try {
      const res = await fetch('http://localhost:3000/todoList');
      const json = await res.json();
      this.setState({ todoList: json });
    } catch (error) {}
  }

  addTodo = async event => {
    try {
      const inputText = this.inputRef.current;
      event.preventDefault();

      const res = await fetch('http://localhost:3000/todoList', {
        method: 'POST',
        body: JSON.stringify({
          text: inputText.value,
          isDone: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const json = await res.json();

      this.setState(
        ({ todoList }) => {
          return {
            todoList: [...todoList, json],
          };
        },
        () => (inputText.value = ''),
      );
    } catch (error) {}
  };

  toggleComplate = async item => {
    try {
      const inputText = this.inputRef.current;
      event.preventDefault();

      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...item,
          isDone: !item.isDone,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const json = await res.json();

      this.setState(({ todoList }, props) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [
            ...todoList.slice(0, index),
            json,
            ...todoList.slice(index + 1),
          ],
        };
      });
    } catch (error) {}
  };

  deleteTodo = async item => {
    try {
      await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'DELETE',
      });
      this.setState(({ todoList }, props) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
        };
      });
    } catch (error) {}
  };

  changeFilterType = filterType => {
    this.setState({ filterType });
  };

  render() {
    const { todoList, filterType } = this.state;
    return (
      <div className="flex flex-col items-center gap-4 m-4 min-h-[95vh]">
        <h1>Todo App </h1>
        <form
          onSubmit={this.addTodo}
          className="flex max-w-sm w-full items-center"
        >
          <Input className="rounded-r-none" ref={this.inputRef} />
          <Button type="sumbit" className="rounded-l-none">
            Button
          </Button>
        </form>
        <div className=" gap-4 flex flex-col w-full flex-1">
          {todoList
            .filter(x => {
              switch (filterType) {
                case 'pending':
                  return x.isDone === false;

                case 'complated':
                  return x.isDone === true;

                default:
                  return true;
              }
            })
            .map(item => {
              return (
                <div key={item.id} className="flex items-center">
                  <Checkbox
                    type="checkbox"
                    checked={item.isDone}
                    onCheckedChange={() => this.toggleComplate(item)}
                  />
                  <p className="flex-1 px-4">{item.text}</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => this.deleteTodo(item)}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
        </div>
        <div className="flex w-full ">
          <Button
            className="flex-1 rounded-none "
            variant={filterType === 'all' ? 'destructive' : 'default'}
            onClick={() => this.changeFilterType('all')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'pending' ? 'destructive' : 'default'}
            onClick={() => this.changeFilterType('pending')}
            className="flex-1 rounded-none"
          >
            Pending
          </Button>
          <Button
            variant={filterType === 'complated' ? 'destructive' : 'default'}
            onClick={() => this.changeFilterType('complated')}
            className="flex-1 rounded-none"
          >
            Complated
          </Button>
        </div>
      </div>
    );
  }
}
