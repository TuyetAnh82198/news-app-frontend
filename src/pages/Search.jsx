import { useState } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Pagination,
  Card,
  Form,
} from "react-bootstrap";

const News = () => {
  //state cho biết trang thứ mấy
  const [page, setPage] = useState(1);
  //state danh sách bài viết
  const [articles, setArticles] = useState([]);
  //state tổng số trang có thể hiển thị
  const [totalPage, setTotalPage] = useState(0);
  //state từ khóa tìm kiếm
  const [keyword, setKeyword] = useState("");

  //hàm tìm bài viết theo từ khóa
  const searchHandler = (keyword, page) => {
    if (keyword !== "") {
      fetch(
        `https://newsapi.org/v2/everything?q=${keyword}&pageSize=5&page=${page}&apiKey=56ab520df6564dec818d126ff3972e6c`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setArticles(data.articles);
          setTotalPage(Math.ceil(data.totalResults / 5));
        })
        .catch((err) => console.log(err));
    } else if (keyword === "") {
      alert("Please enter keywords!");
    }
  };

  return (
    <Container>
      <Container className="p-3">
        <Row as="h2">
          <Col className="my-2">Search</Col>
        </Row>
      </Container>
      <Container className="col-8 my-4">
        <Form className="d-flex justify-content-between">
          <Form.Control
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            type="text"
          />
          <Button onClick={() => searchHandler(keyword, page)} className="mx-4">
            Search
          </Button>
        </Form>
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
      <Container className="my-4 d-flex justify-content-around">
        <Pagination>
          <Pagination.Item
            onClick={() => {
              if (page > 1) {
                setPage((prevState) => (prevState -= 1));
                searchHandler(keyword, page);
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
                searchHandler(keyword, page);
              }
            }}
          >
            Next
          </Pagination.Item>
        </Pagination>
      </Container>
    </Container>
  );
};

export default News;
