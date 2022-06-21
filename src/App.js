import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";

// const BACKEND_URL = "fffdf48ffbd6542322b334842b18afda3ee52cf7";
const buttons = [
    {
        type: "completed",
        label: "completed",
    },

];

/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

    const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };


  const handleAddItem = () => {
    axios.post(`https://api.todoist.com/rest/v1/tasks`, {
        content:itemToAdd,
        done: false
    }, {
        headers:{
            'Authorization': `Bearer fffdf48ffbd6542322b334842b18afda3ee52cf7`,
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        setItems([ ...items, response.data])
    })
    setItemToAdd("");
  };
const handleCompletedItems=()=>{
    axios.get(`https://api.todoist.com/sync/v8/completed/get_all`, {
        headers:{
            'Authorization': `Bearer fffdf48ffbd6542322b334842b18afda3ee52cf7`,
        }
    }).then((response)=>{
        setItems(response.data.items)
    })
}



  const toggleItemDone = (item) => {
    const {id, completed, completed_date}=item;
    if(completed_date){
        axios.post(`https://api.todoist.com/rest/v1/tasks/${item.task_id}/reopen`, {},{
            headers:{
                'Authorization': `Bearer fffdf48ffbd6542322b334842b18afda3ee52cf7`,
            }
        }).then((response)=>{
            setItems(items.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        completed: !completed
                    }
                }
                return item
            }))
        })
    }
    else{
        axios.post(`https://api.todoist.com/rest/v1/tasks/${id}/close`, {
            completed: !item.completed
        }, {
            headers:{
                'Authorization': `Bearer fffdf48ffbd6542322b334842b18afda3ee52cf7`,
                'Content-Type': 'application/json',
            }
        }).then((response) => {

                setItems(items.map((item) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            completed: !completed
                        }
                    }
                    return item
                }))

    }

      )
  }
  };

  // N => map => N
    // N => filter => 0...N
  const handleItemDelete = (id) => {
      axios.delete(`https://api.todoist.com/rest/v1/tasks/${id}`, {
          headers: {
              'Authorization': `Bearer fffdf48ffbd6542322b334842b18afda3ee52cf7`,
          }
      }).then((response) => {
          const newItems = items.filter((item) => {
              return id !== item.id
          })
          setItems(newItems)
      })
  };


  // useEffect(() => {
  //     axios.get(`https://api.todoist.com/rest/v1/tasks`, {headers:{
  //         Authorization: `Bearer fffdf48ffbd6542322b334842b18afda3ee52cf7`
  //     }}).then((activeItemsResponse) => {
  //         axios.get(`https://api.todoist.com/sync/v8/completed/get_all`, {
  //             headers:{
  //                 'Authorization': `Bearer fffdf48ffbd6542322b334842b18afda3ee52cf7`,
  //             }
  //         }).then((completedItemsResponse) => {
  //             setItems([...activeItemsResponse.data, ...completedItemsResponse.data.items])
  //         })
  //     })
  // }, [searchValue])
    useEffect(() => {
        axios.get(`https://api.todoist.com/rest/v1/tasks`, {headers:{
                Authorization: `Bearer fffdf48ffbd6542322b334842b18afda3ee52cf7`
            }}).then((response) => {
            setItems(response.data)
        })
    }, [searchValue])


  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
        <div className="btn-group">
            {buttons.map((item) => (
                <button
                    key={item.type}
                    type="button"
                    className={`btn btn-info`}
                    onClick={() => handleCompletedItems(item)}
                >
                    {item.label}
                </button>
            ))}
        </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
