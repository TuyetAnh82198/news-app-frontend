import { NavLink, Outlet } from "react-router-dom";

import { Row, Col } from "react-bootstrap";
import {
  HouseFill,
  Newspaper,
  ListCheck,
  GearFill,
  Search,
} from "react-bootstrap-icons";

import styles from "./rootLayout.module.css";

const RootLayout = () => {
  return (
    <div className="d-flex">
      <div className="col-2" style={{ minHeight: "100vh" }}>
        <h1 className={styles.newsApp}>News App</h1>
        <nav className={styles.nav}>
          <Row className={`py-2 ${styles.navlink}`}>
            <Col className="col-10">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? styles.isActive : styles.notActive
                }
              >
                <HouseFill className={styles.icon} />
                Home
              </NavLink>
            </Col>
          </Row>
          <Row className={`py-2 ${styles.navlink}`}>
            <Col className="col-10">
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  isActive ? styles.isActive : styles.notActive
                }
              >
                <Newspaper className={styles.icon} />
                News
              </NavLink>
            </Col>
          </Row>
          <Row className={`py-2 ${styles.navlink}`}>
            <Col className="col-10">
              <NavLink
                to="/todo"
                className={({ isActive }) =>
                  isActive ? styles.isActive : styles.notActive
                }
              >
                <ListCheck className={styles.icon} />
                Todo List
              </NavLink>
            </Col>
          </Row>
          <Row className={`py-2 ${styles.navlink}`}>
            <Col className="col-10">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? styles.isActive : styles.notActive
                }
              >
                <GearFill className={styles.icon} />
                Settings
              </NavLink>
            </Col>
          </Row>
          <Row className={`py-2 ${styles.navlink}`}>
            <Col className="col-10">
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive ? styles.isActive : styles.notActive
                }
              >
                <Search className={styles.icon} />
                Search
              </NavLink>
            </Col>
          </Row>
        </nav>
      </div>
      <div className="col-10">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
