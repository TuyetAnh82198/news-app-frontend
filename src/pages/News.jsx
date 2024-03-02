import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Pagination, Card } from "react-bootstrap";

const News = () => {
  //state thông tin người dùng đang đăng nhập
  const [userLoggedIn, setUserLoggedIn] = useState({});
  //state cho biết trang thứ mấy
  const [page, setPage] = useState(1);
  //state danh sách bài viết
  const [articles, setArticles] = useState([]);
  //state tổng số trang có thể hiển thị
  const [totalPage, setTotalPage] = useState(0);

  const navigate = useNavigate();
  //hàm kiểm tra người dùng đã đăng nhập chưa, nếu đã đăng nhập thì sẽ lấy tin tức để hiển thị
  const checkLogin = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.firstName) {
            setUserLoggedIn({
              firstName: data.firstName,
              newsPerPage: data.newsPerPage,
              category: data.category,
            });
            fetch(
              `https://newsapi.org/v2/top-headlines?country=us&category=${data.category}&pageSize=${data.newsPerPage}&page=${page}&apiKey=56ab520df6564dec818d126ff3972e6c`
            )
              .then((response) => response.json())
              .then((newsApiData) => {
                // console.log(newsApiData);
                setArticles(newsApiData.articles);
                setTotalPage(
                  Math.ceil(newsApiData.totalResults / data.newsPerPage)
                );
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
  }, [page]);

  useEffect(() => checkLogin(), [page]);

  return (
    <React.Fragment>
      <Container>
        <Container className="p-3">
          <Row as="h2">
            <Col className="my-2">News</Col>
          </Row>
        </Container>
        {articles.length === 0 && (
          <p className="my-5" style={{ textAlign: "center" }}>
            Loading...
          </p>
        )}
        {articles.length > 0 && (
          <div>
            <Container className="d-flex justify-content-around">
              <Pagination>
                <Pagination.Item
                  onClick={() => {
                    if (page > 1) {
                      setPage((prevState) => (prevState -= 1));
                    }
                  }}
                >
                  Previous
                </Pagination.Item>
                <Pagination.Item linkStyle={{ color: "black" }}>
                  {page}
                </Pagination.Item>
                <Pagination.Item
                  onClick={() => {
                    if (page < totalPage) {
                      setPage((prevState) => (prevState += 1));
                      // console.log(page);
                    }
                  }}
                >
                  Next
                </Pagination.Item>
              </Pagination>
            </Container>
            <Container>
              {articles.map((article) => (
                <Card key={(Math.random() * 10).toString()}>
                  <Row>
                    <Col className="col-12 col-lg-5">
                      <Card.Img variant="top" src={article.urlToImage} />
                    </Col>
                    <Col className="col-12 col-lg-7">
                      <Card.Body>
                        <Card.Title>{article.title}</Card.Title>
                        <Card.Text>{article.description}</Card.Text>
                        <Button variant="primary">View</Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Container>
          </div>
        )}
      </Container>
    </React.Fragment>
  );
};

export default News;
