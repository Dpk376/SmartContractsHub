pragma solidity ^0.8.0;

contract OnlineLearningMarketplace {

address owner; // contract owner

struct Course {
address instructor; // instructor address
string name; // course name
string description; // course description
uint price; // course price
uint enrollment; // number of students enrolled
}

mapping(address => bool) instructors; // mapping of instructors
mapping(address => Course[]) courses; // mapping of courses by instructor

event CourseCreated(address instructor, string name);
event CourseEnrolled(address student, string name);

// constructor
constructor() public {
owner = msg.sender;
}

// function to add an instructor
function addInstructor(address instructor) public {
  require(msg.sender == owner);
  instructors[instructor] = true;
}

// function to create a course
function createCourse(string memory name, string memory description, uint price) public 
{
  require(instructors[msg.sender]);
  Course memory newCourse = Course({
  instructor: msg.sender,
  name: name,
  description: description,
  price: price,
  enrollment: 0
  });
  courses[msg.sender].push(newCourse);
  emit CourseCreated(msg.sender, name);
}

// function to enroll in a course
function enrollInCourse(address instructor, uint courseIndex) public payable 
{
  require(msg.value == courses[instructor][courseIndex].price);
  courses[instructor][courseIndex].enrollment++;
  emit CourseEnrolled(msg.sender, courses[instructor][courseIndex].name);
}

// function to get a list of courses by an instructor
function getCoursesByInstructor(address instructor) public view returns (Course[] memory) 
{
  return courses[instructor];
}

}
