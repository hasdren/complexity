app.post("/log-nutrients", async (req, res) => {
  const { username, logDate, calories, protein, fats, carbohydrates, water } =
    req.body;

  if (!username || !calories || !protein || !fats || !carbohydrates || !water) {
    return res.status(400).json({ error: "All nutrient fields are required." });
  }

  const activityDate = logDate ? new Date(logDate) : new Date();
  const localDate = new Date(activityDate.setHours(0, 0, 0, 0));
  utcDate = localDate.utc;
  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  );

  try {
    const existingLog = await NutrientLog.findOne({
      username,
      date: {
        $gte: utcDate,
        $lt: new Date(utcDate).setDate(utcDate.getDate() + 1),
      },
    });

    if (existingLog) {
      // Update existing log
      existingLog.calories = calories;
      existingLog.protein = protein;
      existingLog.fats = fats;
      existingLog.carbohydrates = carbohydrates;
      existingLog.water = water;

      const updatedLog = await existingLog.save();
      return res.status(200).json({
        success: true,
        message: "Nutrient log updated successfully.",
        updatedLog,
      });
    } else {
      // Create new log
      const newLog = new NutrientLog({
        username,
        date: utcDate,
        calories,
        protein,
        fats,
        carbohydrates,
        water,
      });

      const savedLog = await newLog.save();
      return res.status(201).json({
        success: true,
        message: "Nutrient log created successfully.",
        savedLog,
      });
    }
  } catch (error) {
    console.error("Error logging nutrients:", error);
    res.status(500).json({ error: "Server error while logging nutrients." });
  }
});