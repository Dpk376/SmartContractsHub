pragma solidity ^0.8.0;

contract School {
    address public owner;
    mapping (address => bool) public students;
    mapping (address => uint) public grades;
    mapping (address => bool) public certified;
    mapping (address => address) public teachers;
    // added mapping
    uint8 public gradeScale;
    // added grade scale

    struct Course {
        address teacher;
        string name;
        uint credits;
    }
    mapping(address => Course[]) public studentCourses;

    constructor() public {
        owner = msg.sender;
        gradeScale = 100;
    }

    function addStudent(address student) public {
        require(msg.sender == owner, "Only the owner can add students.");
        students[student] = true;
    }

    function removeStudent(address student) public {
        require(msg.sender == owner, "Only the owner can remove students.");
        students[student] = false;
        certified[student] = false;
        // added line to remove certification status
        grades[student] = 0;
        delete studentCourses[student];
    }

    function assignGrade(address student, uint grade) public {
        require(msg.sender == owner, "Only the owner can assign grades.");
        require(students[student], "Student must be enrolled to receive a grade.");
        require(grade <= gradeScale, "Grade exceeds the scale limit");
        // added grade validation
        grades[student] = grade;
        if (grade >= 60) {
            certified[student] = true;
        }
    }

    function getGrade(address student) public view returns (uint) {
        return grades[student];
    }

    function isCertified(address student) public view returns (bool) {
        return certified[student];
    }
    // added function to check certification status

    function setGradeScale(uint8 _gradeScale) public {
        require(msg.sender == owner, "Only the owner can set the grade scale.");
        gradeScale = _gradeScale;
    }
    // added function to set grade scale

    function addTeacher(address teacher) public {
        require(msg.sender == owner, "Only the owner can add teachers.");
        teachers[teacher] = teacher;
    }

    function removeTeacher(address teacher) public {
        require(msg.sender == owner, "Only the owner can remove teachers.");
        require(teachers[teacher] != address(0), "Teacher is not registered.");
        teachers[teacher] = address(0);
    }

    function addCourse(address student, address teacher, string memory name, uint credits) public {
        require(students[student], "Student must be enrolled.");
        require(teachers[teacher], "Teacher must be registered.");
        Course memory newCourse = Course({teacher: teacher, name: name, credits: credits});
        studentCourses[student].push(newCourse);
    }
    // added function to add a course for a student
}
