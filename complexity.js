app.post("/update-user-profile", async (req, res) => {
  const { username, newDob, weight, height, gender, goal, newPassword } =
    req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let updatedPassword = user.password;
    if (newPassword) {
      updatedPassword = await bcrypt.hash(newPassword, 10); 
    }

    user.dob = newDob || user.dob;
    user.weight = weight || user.weight;
    user.height = height || user.height;
    user.gender = gender || user.gender;
    user.goal = goal || user.goal;
    user.password = updatedPassword; 

  
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
