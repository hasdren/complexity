app.post("/update-user-profile", async (req, res) => {
  const { username, newDob, weight, height, gender, goal, newPassword } =
    req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If a new password is provided, hash it before saving
    let updatedPassword = user.password; // Keep the current password if no new one is provided
    if (newPassword) {
      updatedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    }

    // Update the user profile
    user.dob = newDob || user.dob;
    user.weight = weight || user.weight;
    user.height = height || user.height;
    user.gender = gender || user.gender;
    user.goal = goal || user.goal;
    user.password = updatedPassword; // Update password if new password was provided
    // Save the updated user data
    await user.save();

    // Respond with success
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile." });
  }
});