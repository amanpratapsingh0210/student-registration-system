document.addEventListener('DOMContentLoaded', () => {
    
    // Selecting DOM elements
    const form = document.getElementById('student-form');
    const submitBtn = document.getElementById('submit-btn');
    const studentNameInput = document.getElementById('student-name');
    const studentIdInput = document.getElementById('student-id');
    const emailIdInput = document.getElementById('email-id');
    const contactNoInput = document.getElementById('contact-no');
    const studentList = document.getElementById('student-list');

    // Load students from localStorage or initialize an empty array
    let students = JSON.parse(localStorage.getItem('students')) || [];
    // Variable to track if we are editing an existing student
    let editIndex = -1;

    // This function is called whenever the student data changes, it renders the list of students into the table
    const renderStudents = () => {
        // Clear the current list
        studentList.innerHTML = '';

        // If there are no students, display a message
        if (students.length === 0) {
            studentList.innerHTML = `<tr><td colspan="5">No students registered yet.</td></tr>`;
            return;
        }

        // Create a table row for each student
        students.forEach((student, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="action-btn edit-btn" data-index="${index}">Edit</button>
                    <button class="action-btn delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            studentList.appendChild(tr);
        });
    };

     //Saves the current students array to localStorage.
    const saveToLocalStorage = () => {
        localStorage.setItem('students', JSON.stringify(students));
    };

    /**
    Validates all form inputs based on the assignment criteria.
    @returns {boolean} - True if all fields are valid, otherwise false.
    */
    const validateForm = () => {
        const name = studentNameInput.value.trim();
        const id = studentIdInput.value.trim();
        const email = emailIdInput.value.trim();
        const contact = contactNoInput.value.trim();

        // Regex for validation
        const nameRegex = /^[A-Za-z\s]+$/;
        const idRegex = /^[0-9]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactRegex = /^[0-9]{10,}$/; // At least 10 digits

        if (!name || !id || !email || !contact) {
            alert("Please fill in all fields.");
            return false;
        }
        if (!nameRegex.test(name)) {
            alert("Student Name must contain only characters and spaces.");
            return false;
        }
        if (!idRegex.test(id)) {
            alert("Student ID must contain only numbers.");
            return false;
        }
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }
        if (!contactRegex.test(contact)) {
            alert("Contact Number must contain at least 10 digits.");
            return false;
        }

        return true;
    };

    // Handle form submission for adding or updating a student
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validate the form before proceeding
        if (!validateForm()) {
            // Stop if validation fails
            return;
        }
        
        const newStudent = {
            name: studentNameInput.value.trim(),
            id: studentIdInput.value.trim(),
            email: emailIdInput.value.trim(),
            contact: contactNoInput.value.trim(),
        };

        if (editIndex === -1) {
            // Adding a new student
            students.push(newStudent);
        } else {
            // Updating an existing student
            students[editIndex] = newStudent;
            // Reset edit index
            editIndex = -1; 
            // Reset button text
            submitBtn.textContent = 'Register Student'; 
        }
        
        saveToLocalStorage(); // Save updated array to localStorage
        renderStudents(); // Re-render the table
        form.reset(); // Clear the form fields
    });

    // Handle clicks on "Edit" and "Delete" buttons
    studentList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;

        if (e.target.classList.contains('edit-btn')) {
            // Editing a Student
            const student = students[index];
            studentNameInput.value = student.name;
            studentIdInput.value = student.id;
            emailIdInput.value = student.email;
            contactNoInput.value = student.contact;
            
            // Set the index of the student being edited
            editIndex = index;
            // Change button text to indicate editing 
            submitBtn.textContent = 'Update Student'; 
        }

        if (e.target.classList.contains('delete-btn')) {
            // Deleting a Student
            if (confirm('Are you sure you want to delete this record?')) {
                // Remove the student from the array
                students.splice(index, 1); 
                saveToLocalStorage();
                renderStudents();
            }
        }
    });

    // Render the students list when the page loads
    renderStudents();
});