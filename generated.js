app.post("/update-user-profile", async (req, res) => {
  const { username, newDob, weight, height, gender, goal, newPassword } =
    req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user fields if provided
    if (newDob) user.dob = newDob;
    if (weight) user.weight = weight;
    if (height) user.height = height;
    if (gender) user.gender = gender;
    if (goal) user.goal = goal;

    // Hash and update password if a new one is provided
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Save the updated user data
    await user.save();

    // Respond with success
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      error: "An error occurred while updating the profile.",
    });
  }
});
