import React from "react";
import "./style.css";

export default () => {

    const emailRef = React.useRef(null);
    const [data,setdata] = React.useState(null);

    const getDetails = event => {
        fetch("http://localhost:3000/getReference?email=" + emailRef.current.value)
        .then(res => res.json())
        .then(setdata)
        .catch(console.error);
    };
    
    return <section>
        <div className="inline-style">
            <label>Email Address:</label>
            <input type="email" ref={emailRef} id="email-address" name="email-address" placeholder="John@domain.com"/>
        </div>
        <div className="inline-style">
            <button onClick={getDetails}>Get Reference Id from Database</button>
        </div>
        {data && (<Todo email={data?.data?.email}></Todo>)}
        {data && (<GetAllTodosByEmail email={data?.data?.email}/>)}
    </section>
}

function Todo({email}) {
    const todoTextRef = React.useRef(null);

    const noteSaveHandler = event => {
        const body = JSON.stringify({email , text : todoTextRef.current.value});
        console.log("sending :" , body);
        fetch("http://localhost:3000/add" , {
            method: "POST",
            body ,
            mode: 'cors',
            headers : {"Content-Type": "application/json"}
        })
        .then(res => {
            if (res.ok) {
                todoTextRef.current.value = "";
                todoTextRef.current.focus();
            } else {
                console.log("== something went wrong ===");
            }
        }).catch(console.error);
    };
    return <>
    <section>
        <div>
            <label>Text / Note :</label>
            <textarea id="todo-text" id="todo-text" ref={todoTextRef} placeholder="Provide a note / todo"></textarea>
        </div>
        <div>
            <button onClick={noteSaveHandler}>Save note</button>
        </div>
    </section>
    </>
}

function GetAllTodosByEmail({email}) {
    const [data,setdata] = React.useState(null);
    const todosHandler = event => {
        fetch("http://localhost:3000/alltodos?email=" + email).then(r =>r.json()).then(setdata).catch(console.error);
    };
    console.log(data?.data);
    return <>
        <button onClick={todosHandler}>Fetch all todos</button>
        <ul>{
            data?.data.map((x,i)=> <li key={i}>{x}</li>)
           
        }</ul>
    </>;
}