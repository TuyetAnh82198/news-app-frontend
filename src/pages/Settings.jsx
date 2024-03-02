import { Container, Button, Row, Col, Form } from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  //state thiết đặt số trang hiển thị và danh mục hiển thị
  const [newsPerPage, setNewsPerPage] = useState(0);
  const [newsCategory, setNewsCategory] = useState("Select Category");
  //state tên người dùng đang đăng nhập
  const [userLoggedIn, setUserLoggedIn] = useState("");
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  //hàm kiểm tra người dùng đã đăng nhập chưa
  const checkLogin = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.firstName) {
            setIsLoggedIn(true);
            setUserLoggedIn(data.username);
            setNewsPerPage(data.newsPerPage);
            setNewsCategory(data.category);
          } else if (data.message === "have not been logged in yet!") {
            setIsLoggedIn(false);
            navigate("/");
          }
        } else {
          navigate(`${process.env.REACT_APP_FRONTEND}/server-error`);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => checkLogin(), []);

  //hàm lưu cài đặt của người dùng
  const submitForm = () => {
    if (newsPerPage > 0) {
      console.log({
        username: userLoggedIn,
        newsPerPage: newsPerPage,
        category: newsCategory,
      });
      fetch(`${process.env.REACT_APP_BACKEND}/settings/update`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userLoggedIn,
          newsPerPage: newsPerPage,
          category: newsCategory,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Saved!") {
            alert("Saved!");
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert("Please enter a valid News Per Page");
    }
  };

  return (
    <React.Fragment>
      {isLoggedIn && (
        <Container className="mt-2 p-3">
          <Container className="p-3">
            <Row as="h2">
              <Col className="my-2">Settings</Col>
            </Row>
          </Container>
          <Container className="col-lg-4 col-xl-5">
            <Form>
              <Form.Group as={Row} className="mb-3" controlId="newsPerPage">
                <Form.Label column sm="4">
                  News per page
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    value={newsPerPage}
                    onChange={(e) => {
                      setNewsPerPage(e.target.value);
                    }}
                    type="number"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="pass">
                <Form.Label column sm="4">
                  News Category
                </Form.Label>
                <Col sm="8">
                  <Form.Select
                    onChange={(e) => {
                      setNewsCategory(e.target.value);
                      // console.log(e.target.value);
                    }}
                  >
                    <option value={newsCategory}>{newsCategory}</option>
                    {[
                      "General",
                      "Business",
                      "Technology",
                      "Sports",
                      "Science",
                      "Entertainment",
                      "Health",
                    ]
                      .filter((item) => item !== newsCategory)
                      .sort((a, b) => a - b)
                      .map((item) => (
                        <option
                          key={(Math.random() * 5).toString()}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group>
                <Button onClick={submitForm}>Save Settings</Button>
              </Form.Group>
            </Form>
          </Container>
        </Container>
      )}
    </React.Fragment>
  );
};

export default Settings;
