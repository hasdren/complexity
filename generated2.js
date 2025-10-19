app.post("/log-nutrients", async (req, res) => {
  const { username, logDate, calories, protein, fats, carbohydrates, water } =
    req.body;

  // Basic validation
  /* if (!username || !calories || !protein || !fats || !carbohydrates || !water) {
    return res.status(400).json({ error: "All nutrient fields are required." });
  }
*/

  // Normalize date to UTC midnight
  /*const date = new Date(logDate || Date.now());
  date.setUTCHours(0, 0, 0, 0);
  */

  try {
    // Find existing log for the same user and date
    const existingLog = await NutrientLog.findOne({ username, date });

    if (existingLog) {
      // Update existing log
      Object.assign(existingLog, {
        calories,
        protein,
        fats,
        carbohydrates,
        water,
      });
      const updatedLog = await existingLog.save();
      return res.status(200).json({
        success: true,
        message: "Nutrient log updated successfully.",
        updatedLog,
      });
    }

    // Create new log if not exists
    const savedLog = await NutrientLog.create({
      username,
      date,
      calories,
      protein,
      fats,
      carbohydrates,
      water,
    });

    res.status(201).json({
      success: true,
      message: "Nutrient log created successfully.",
      savedLog,
    });
  } catch (error) {
    console.error("Error logging nutrients:", error);
    res.status(500).json({ error: "Server error while logging nutrients." });
  }
});
