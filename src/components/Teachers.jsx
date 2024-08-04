import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  setTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} from "../redux/teacherSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const Teachers = () => {
  const dispatch = useDispatch();
  const teachers = useSelector(state => state.teachers.teachers);

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    email: "",
    completed: false,
    level: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 5;

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        // Fake level data qo'shish
        const teachersWithLevel = response.data.map((teacher, index) => ({
          ...teacher,
          level: ["Senior", "Middle", "Junior"][index % 3], // Har bir teacherga level qo'shish
        }));
        dispatch(setTeachers(teachersWithLevel));
        toast.success("Teachers loaded successfully");
      })
      .catch(error => {
        console.error("Error fetching teachers:", error);
        toast.error("Failed to load teachers");
      });
  }, [dispatch]);

  const handleShowModal = (teacher = null) => {
    setEditingTeacher(teacher);
    setFormValues(
      teacher
        ? {
            name: teacher.name,
            username: teacher.username,
            email: teacher.email,
            completed: teacher.completed,
            level: teacher.level,
          }
        : { name: "", username: "", email: "", completed: false, level: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
  };

  const handleDelete = id => {
    dispatch(deleteTeacher(id));
    toast.success("Teacher deleted successfully");
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (editingTeacher) {
      dispatch(updateTeacher({ id: editingTeacher.id, data: formValues }));
      toast.success("Teacher updated successfully");
    } else {
      const newTeacher = { id: teachers.length + 1, ...formValues };
      dispatch(addTeacher(newTeacher));
      toast.success("Teacher added successfully");
    }
    handleCloseModal();
  };

  const handleChange = event => {
    const { name, value, type, checked } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = event => {
    setFilterStatus(event.target.value);
  };

  const handleLevelFilterChange = event => {
    setFilterLevel(event.target.value);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "completed" && teacher.completed) ||
      (filterStatus === "not_completed" && !teacher.completed);
    const matchesLevel = filterLevel === "" || teacher.level === filterLevel;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4" style={{ paddingLeft: "160px" }}>
      <h1>Teacher List</h1>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Teacher
      </Button>

      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="form-control mt-3 w-25"
      />

      <select
        name="statusFilter"
        value={filterStatus}
        onChange={handleFilterChange}
        className="form-control mt-3 w-25">
        <option value="">All</option>
        <option value="completed">Completed</option>
        <option value="not_completed">Not Completed</option>
      </select>

      <select
        name="levelFilter"
        value={filterLevel}
        onChange={handleLevelFilterChange}
        className="form-control mt-3 w-25">
        <option value="">All Levels</option>
        <option value="Senior">Senior</option>
        <option value="Middle">Middle</option>
        <option value="Junior">Junior</option>
      </select>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Completed</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTeachers.map(teacher => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.name}</td>
              <td>{teacher.username}</td>
              <td>{teacher.email}</td>
              <td>{teacher.completed ? "✔️" : "❌"}</td>
              <td>{teacher.level}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(teacher)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(teacher.id)}
                  style={{ marginLeft: 8 }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTeacher ? "Edit Teacher" : "Add Teacher"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCompleted">
              <Form.Check
                type="checkbox"
                label="Completed"
                name="completed"
                checked={formValues.completed}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formLevel">
              <Form.Label>Level</Form.Label>
              <Form.Control
                type="text"
                name="level"
                value={formValues.level}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {editingTeacher ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Teachers;
