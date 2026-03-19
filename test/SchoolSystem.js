const School = artifacts.require("School");

contract("School", accounts => {
    let school;
    let owner = accounts[0];
    let student1 = accounts[1];
    let student2 = accounts[2];
    let teacher1 = accounts[3];
    let teacher2 = accounts[4];

    beforeEach(async () => {
        school = await School.new();
    });

    it("should add a student", async () => {
        await school.addStudent(student1);
        let isStudent = await school.students(student1);
        assert.equal(isStudent, true, "Student was not added");
    });

    it("should remove a student", async () => {
        await school.addStudent(student1);
        await school.removeStudent(student1);
        let isStudent = await school.students(student1);
        assert.equal(isStudent, false, "Student was not removed");
    });

    it("should assign a grade to a student", async () => {
        await school.addStudent(student1);
        await school.assignGrade(student1, 80);
        let grade = await school.getGrade(student1);
        assert.equal(grade, 80, "Grade was not assigned");
    });

    it("should return certification status of a student", async () => {
        await school.addStudent(student1);
        await school.assignGrade(student1, 80);
        let isCertified = await school.isCertified(student1);
        assert.equal(isCertified, true, "Student should be certified");
    });

    it("should add a teacher", async () => {
        await school.addTeacher(teacher1);
        let isTeacher = await school.teachers(teacher1);
        assert.equal(isTeacher, teacher1, "Teacher was not added");
    });

    it("should remove a teacher", async () => {
        await school.addTeacher(teacher1);
        await school.removeTeacher(teacher1);
        let isTeacher = await school.teachers(teacher1);
        assert.equal(isTeacher, address(0), "Teacher was not removed");
    });

    it("should add a course for a student", async () => {
        await school.addStudent(student1);
        await school.addTeacher(teacher1);
        await school.addCourse(student1, teacher1, "Math", 3);
        let studentCourses = await school.studentCourses(student1);
        let addedCourse = studentCourses[0];
        assert.equal(addedCourse.name, "Math", "Course was not added for the student");
    });
});
