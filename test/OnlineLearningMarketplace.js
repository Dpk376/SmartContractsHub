it("should allow the owner to enroll a user as an instructor", async () => {
    let instance = await OnlineLearningMarketplace.deployed();

    // Enroll a user as an instructor
    await instance.enrollAsInstructor({ from: owner });

    // Check if the user is enrolled as an instructor
    let isInstructor = await instance.isInstructor(user);
    assert.equal(isInstructor, true, "User was not enrolled as an instructor");
});
it("should allow a user to purchase a course", async () => {
    let instance = await OnlineLearningMarketplace.deployed();

    // Enroll a user as an instructor
    await instance.enrollAsInstructor({ from: owner });

    // Add a course to the marketplace
    let courseName = "Test Course";
    let coursePrice = web3.utils.toWei("1", "ether");
    await instance.addCourse(courseName, coursePrice, { from: user });

    // Purchase the course
    await instance.purchaseCourse(user, { from: student, value: coursePrice });

    // Check if the student's balance has been updated
    let studentBalance = await instance.userBalances(student);
    assert.equal(studentBalance, 0, "Student's balance was not updated correctly");

    // Check if the course has been added to the student's enrollment list
    let isEnrolled = await instance.courseEnrollments(student, user);
    assert.equal(isEnrolled, true, "Course was not added to student's enrollment list");
});
it("should not allow a user to purchase a course with insufficent fund", async () => {
    let instance = await OnlineLearningMarketplace.deployed();

    // Enroll a user as an instructor
    await instance.enrollAsInstructor({ from: owner });

    // Add a course to the marketplace
    let courseName = "Test Course";
    let coursePrice = web3.utils.toWei("1", "ether");
    await instance.addCourse(courseName, coursePrice, { from: user });

    try {
        // Attempt to purchase the course with insufficent fund
        await instance.purchaseCourse(user, { from: student, value: coursePrice/2 });
    } catch (error) {
        assert.equal(error.reason, "Not Enough Funds", "User should not be able to purchase the course with insufficent fund");
    }
});
