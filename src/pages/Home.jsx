import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import generator from "generate-password-browser";

import styles from "./home.module.css";

const Home = () => {
  //state ẩn, hiện form register
  const [register, setRegister] = useState(false);
  //state ẩn, hiện bảng tạo mật khẩu tự động
  const [generateRandomPass, setGenerateRandomPass] = useState(false);
  //state mật khẩu được tạo tự động
  const [randomPass, setRandomPass] = useState("");
  //state giao diện trước và sau khi đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state firstName của người dùng đang đăng nhập để hiện trên thông điệp chào mừng
  const [firstNameLoggedIn, setFirstNameLoggedIn] = useState("");

  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const usernameInput = useRef();
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

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
            setFirstNameLoggedIn(data.firstName);
            // console.log(data.firstName);
          } else if (data.message === "have not been logged in yet!") {
            setIsLoggedIn(false);
          }
        } else {
          navigate(`${process.env.REACT_APP_FRONTEND}/server-error`);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => checkLogin(), []);

  //hàm đăng ký hoặc đăng nhập
  const navigate = useNavigate();
  const submitForm = () => {
    if (register) {
      fetch(`${process.env.REACT_APP_BACKEND}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstNameInput.current.value,
          lastName: lastNameInput.current.value,
          username: usernameInput.current.value,
          pass: pass,
          confirmPass: confirmPass,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.errs) {
              alert(data.errs[0]);
            } else if (data.message === "Created!") {
              alert("Created!");
              setRegister(false);
              setGenerateRandomPass(false);
              setPass("");
              setConfirmPass("");
            } else if (data.message === "Existing user!") {
              alert("Existing user!");
            }
          } else {
            navigate(`${process.env.REACT_APP_FRONTEND}/server-error`);
          }
        })
        .catch((err) => console.log(err));
    } else {
      fetch(`${process.env.REACT_APP_BACKEND}/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.current.value,
          pass: pass,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.errs) {
              alert(data.errs);
            } else if (data.message === "You are logged in!") {
              alert("You are logged in!");
              setIsLoggedIn(true);
            } else if (data.message === "Wrong user or password!") {
              alert("Wrong user or password!");
            }
          } else {
            navigate(`${process.env.REACT_APP_FRONTEND}/server-error`);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //hàm tạo mật khẩu ngẫu nhiên
  const generatePassFn = () => {
    const passCreated = generator.generate({
      length: 8,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      excludeSimilarCharacters: false,
    });
    // console.log(passCreated);
    setRandomPass(passCreated);
  };

  //hàm copy mật khẩu ngẫu nhiên đã tạo vào trường Password
  const copyToPassword = () => {
    // console.log(randomPass);
    setPass(randomPass);
    setConfirmPass(randomPass);
  };

  //hàm đăng xuất
  const logout = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "You are logged out.") {
          alert("You are logged out.");
          setIsLoggedIn(false);
        } else if (data.err) {
          alert(data.err);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Container className="p-3">
        <Row as="h2">
          <Col className="my-2">Home</Col>
        </Row>
        <Row>
          <Col className="mb-2">
            {isLoggedIn
              ? `Welcome ${firstNameLoggedIn}`
              : "Please Login or Register"}
          </Col>
        </Row>
        {isLoggedIn && (
          <Row>
            <Col className="col-6 col-lg-4 col-xxl-3">
              <Button onClick={logout}>Logout</Button>
            </Col>
          </Row>
        )}
        {!isLoggedIn && (
          <Row>
            <Col className="col-6 col-lg-4 col-xxl-3">
              <Button
                onClick={() => {
                  setRegister(false);
                  setGenerateRandomPass(false);
                }}
                className="w-100"
                variant="primary"
              >
                Login
              </Button>
            </Col>
            <Col className="col-6 col-lg-4 col-xxl-3">
              <Button
                onClick={() => setRegister(true)}
                className="w-100"
                variant="primary"
              >
                Register
              </Button>
            </Col>
          </Row>
        )}
      </Container>
      {!isLoggedIn && (
        <Container>
          {register && (
            <Container className="mt-2 p-3">
              <Row as="h5" className="mb-3">
                Register New User
              </Row>
              <Container className="col-lg-7 col-xl-8">
                <Form>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label className={styles.label} column sm="2">
                      First Name
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control ref={firstNameInput} type="text" />
                    </Col>
                    <Form.Label className={styles.label} column sm="2">
                      Last Name
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control ref={lastNameInput} type="text" />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="username">
                    <Form.Label className={styles.label} column sm="2">
                      Username
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control ref={usernameInput} type="text" />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="pass">
                    <Form.Label className={styles.label} column sm="2">
                      Password
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        value={pass}
                        onChange={(e) => {
                          setPass(e.target.value);
                          // console.log(pass);
                        }}
                        onClick={() => setGenerateRandomPass(true)}
                        type="password"
                      />
                      {generateRandomPass && (
                        <Container className="mt-2">
                          <Row className="d-flex justify-content-around">
                            <Col className={`col-xl-4 ${styles.label}`}>
                              Would you like to use a random password?
                            </Col>
                            <Col className="col-xl-4">
                              <Button
                                onClick={generatePassFn}
                                className={`w-100 ${styles.label}`}
                                variant="warning"
                              >
                                Click to generate
                              </Button>
                            </Col>
                          </Row>
                          <Row className="d-flex justify-content-around">
                            <Col
                              style={{
                                backgroundColor: "#cccccc",
                              }}
                              className={`col-xl-4 ${styles.label}`}
                            >
                              <p className="pt-2">{randomPass}</p>
                            </Col>
                            <Col className="col-xl-4">
                              <Button
                                onClick={copyToPassword}
                                className={`mt-1 w-100 ${styles.label}`}
                                variant="warning"
                              >
                                Copy to Password
                              </Button>
                            </Col>
                          </Row>
                        </Container>
                      )}
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="confirmPass">
                    <Form.Label className={styles.label} column sm="2">
                      Confirm Password
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        type="password"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group>
                    <Button className={styles.label} onClick={submitForm}>
                      Register
                    </Button>
                  </Form.Group>
                </Form>
              </Container>
            </Container>
          )}
          {!register && (
            <Container className="mt-2 p-3">
              <Row as="h5" className="mb-3">
                Login
              </Row>
              <Container className="col-lg-7 col-xl-8">
                <Form>
                  <Form.Group as={Row} className="mb-3" controlId="username">
                    <Form.Label className={styles.label} column sm="2">
                      Username
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control ref={usernameInput} type="text" />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="pass">
                    <Form.Label className={styles.label} column sm="2">
                      Password
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        type="password"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group>
                    <Button onClick={submitForm} className={styles.label}>
                      Login
                    </Button>
                  </Form.Group>
                </Form>
              </Container>
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
};

export default Home;
