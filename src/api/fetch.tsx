
const API_URL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_TODOIST_TOKEN;
  
async function getTodos(){
    const response = await fetch (API_URL + "/tasks",
         {headers: {"Authorization": `Bearer ${token}`}});
    const data = await response.json();
    console.log("todos are", data);
    return data;

}

async function addTodos(todo: Todo){
    const response = await fetch (API_URL + "/tasks",
         { method: "POST",
         headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
    body: JSON.stringify(todo),
});
    const data = await response.json();
    console.log("todos are", data);
    return data;

}

export {addTodos};
export {getTodos};