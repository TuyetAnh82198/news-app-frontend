import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  CloseButton,
  ListGroup,
} from "react-bootstrap";
import { Check2 } from "react-bootstrap-icons";

import { socket } from "../socket.js";

import styles from "./todo.module.css";

const Todo = () => {
  //state thông tin người dùng đang đăng nhập
  const [userLoggedIn, setUserLoggedIn] = useState({});
  //state nhập task
  const [taskInput, setTaskInput] = useState("");
  //state danh sách task
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();
  //hàm kiểm tra người dùng đã đăng nhập chưa, nếu đã đăng nhập thì sẽ lấy danh sách các task
  const checkLogin = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          console.log(data);
          if (data.firstName) {
            setUserLoggedIn({
              firstName: data.firstName,
              newsPerPage: data.newsPerPage,
              category: data.category,
              username: data.username,
            });
            fetch(`${process.env.REACT_APP_BACKEND}/todo/get/${data.username}`)
              .then((response2) => response2.json())
              .then((data2) => {
                // console.log(data.username);
                setTasks(data2.result);
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (data.message === "have not been logged in yet!") {
            navigate("/");
          }
        } else {
          navigate(`${process.env.REACT_APP_FRONTEND}/server-error`);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => checkLogin(), []);

  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  });

  useEffect(() => {
    const todoHandler = (data) => {
      if (data.action === "add") {
        setTasks(data.addResult);
      } else if (data.action === "update") {
        setTasks(data.updateResult);
      } else if (data.action === "delete") {
        setTasks(data.deleteResult);
      }
    };
    socket.on("todo", todoHandler);
    return () => {
      socket.off("todo", todoHandler);
    };
  });

  //hàm thêm task
  const addTask = () => {
    if (taskInput !== "") {
      fetch(`${process.env.REACT_APP_BACKEND}/todo/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskInput,
          owner: userLoggedIn.username,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Added!") {
            alert("Added!");
          }
        })
        .catch((err) => console.log(err));
      setTaskInput("");
    } else {
      alert("Please enter task!");
    }
  };

  //hàm đánh dấu task hoặc hoàn tác đánh dấu
  const done = (id) => {
    fetch(`${process.env.REACT_APP_BACKEND}/todo/done/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "have not been logged in yet") {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  //hàm xóa task ra khỏi danh sách
  const deleteTask = (id) => {
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      fetch(`${process.env.REACT_APP_BACKEND}/todo/deleteItem/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "have not been logged in yet") {
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <React.Fragment>
      {userLoggedIn.firstName && (
        <Container>
          <Container className="p-3">
            <Row as="h2">
              <Col className="my-2">Todo List</Col>
            </Row>
          </Container>
          <Container
            className="pt-4 pb-2 px-4"
            style={{ backgroundColor: "#353846" }}
          >
            <InputGroup className="mb-3">
              <Form.Control
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="rounded-0"
                placeholder="Title..."
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
              <Button
                onClick={addTask}
                className="col-2 col-xxl-1 border-0"
                variant="secondary"
                id="button-addon2"
              >
                Add
              </Button>
              <Button
                onClick={() => setTaskInput("")}
                variant="danger"
                className="rounded-0 col-2 col-xxl-1"
                id="button-addon2"
              >
                Reset
              </Button>
            </InputGroup>
          </Container>
          <ListGroup className="rounded-0">
            {tasks.map((task, i) => (
              <ListGroup.Item
                onClick={() => done(task._id)}
                style={
                  i % 2
                    ? task.isDone
                      ? {
                          textDecoration: "line-through",
                          color: "white",
                          backgroundColor: "#878787",
                        }
                      : { backgroundColor: "#f9f9f9" }
                    : task.isDone
                    ? {
                        textDecoration: "line-through",
                        color: "white",
                        backgroundColor: "#878787",
                      }
                    : { backgroundColor: "#ededed" }
                }
                key={task._id}
                className={`d-flex justify-content-between align-items-start ${styles.isActive}`}
              >
                {task.isDone ? (
                  <Check2 />
                ) : (
                  <span style={{ padding: "0.5rem" }}></span>
                )}
                <div className="ms-2 me-auto">{task.task}</div>
                <CloseButton
                  onClick={() => deleteTask(task._id)}
                  className={styles.closeBtn}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      )}
    </React.Fragment>
  );
};

export default Todo;
