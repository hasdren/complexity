app.post("/register", async (req, res) => {
  const { username, password, dob, height, weight, gender, goal } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // If the username already exists, send an error response
      return res.status(400).json({ error: "Username is already taken." });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // If the username is unique, create a new user
    const newUser = new User({
      username,
      password: hashedPassword, // Save the hashed password
      dob,
      height,
      weight,
      gender,
      goal,
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});