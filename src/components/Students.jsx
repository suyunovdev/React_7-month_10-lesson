import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import {
  setStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../redux/studentSlice";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const Students = () => {
  const dispatch = useDispatch();
  const students = useSelector(state => state.students.students);

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    email: "",
    completed: false,
    group: "", // Guruh qo‘shildi
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGroup, setFilterGroup] = useState(""); // Guruh filtri
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        // Fake guruh ma'lumotlarini qo‘shish
        const studentsWithGroup = response.data.map((student, index) => ({
          ...student,
          group: ["Group A", "Group B", "Group C"][index % 3], // Har bir studentga guruh qo‘shish
        }));
        dispatch(setStudents(studentsWithGroup));
        toast.success("Students loaded successfully");
      })
      .catch(error => {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
      });
  }, [dispatch]);

  const handleShowModal = (student = null) => {
    setEditingStudent(student);
    setFormValues(
      student
        ? {
            name: student.name,
            username: student.username,
            email: student.email,
            completed: student.completed,
            group: student.group, // Guruhni qo‘shish
          }
        : { name: "", username: "", email: "", completed: false, group: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleDelete = id => {
    dispatch(deleteStudent(id));
    toast.success("Student deleted successfully");
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (editingStudent) {
      dispatch(updateStudent({ id: editingStudent.id, data: formValues }));
      toast.success("Student updated successfully");
    } else {
      const newStudent = { id: students.length + 1, ...formValues };
      dispatch(addStudent(newStudent));
      toast.success("Student added successfully");
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

  const handleGroupFilterChange = event => {
    setFilterGroup(event.target.value);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "completed" && student.completed) ||
      (filterStatus === "not_completed" && !student.completed);
    const matchesGroup = filterGroup === "" || student.group === filterGroup;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4 " style={{ paddingLeft: "160px" }}>
      <h1>Student List</h1>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Student
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
        name="groupFilter"
        value={filterGroup}
        onChange={handleGroupFilterChange}
        className="form-control mt-3 w-25">
        <option value="">All Groups</option>
        <option value="Group A">Group A</option>
        <option value="Group B">Group B</option>
        <option value="Group C">Group C</option>
      </select>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Completed</th>
            <th>Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.username}</td>
              <td>{student.email}</td>
              <td>{student.completed ? "✔️" : "❌"}</td>
              <td>{student.group}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(student)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(student.id)}
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
            {editingStudent ? "Edit Student" : "Add Student"}
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
            <Form.Group controlId="formUsername" className="mt-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCompleted" className="mt-3">
              <Form.Check
                type="checkbox"
                name="completed"
                label="Completed"
                checked={formValues.completed}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formGroup" className="mt-3">
              <Form.Label>Group</Form.Label>
              <Form.Control
                type="text"
                name="group"
                value={formValues.group}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {editingStudent ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Students;
