app.post("/log-nutrients", async (req, res) => {
  const { username, logDate, calories, protein, fats, carbohydrates, water } =
    req.body;

  // Validate required fields
  const requiredFields = {
    username,
    calories,
    protein,
    fats,
    carbohydrates,
    water,
  };
  const missingFields = Object.entries(requiredFields)
    .filter(
      ([_, value]) => value == null || value === undefined || value === ""
    )
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields.",
      missingFields,
    });
  }

  // Helper: Get UTC midnight for a given date
  const getUtcDate = (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    return new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );
  };

  const utcDate = getUtcDate(logDate || new Date());

  // Calculate next day UTC midnight
  const nextDayUtc = new Date(utcDate);
  nextDayUtc.setDate(nextDayUtc.getDate() + 1);

  try {
    const existingLog = await NutrientLog.findOne({
      username,
      date: { $gte: utcDate, $lt: nextDayUtc },
    });

    const logData = {
      calories,
      protein,
      fats,
      carbohydrates,
      water,
      date: utcDate,
    };

    let result;
    let status = 201;
    let message = "Nutrient log created successfully.";

    if (existingLog) {
      Object.assign(existingLog, logData);
      result = await existingLog.save();
      status = 200;
      message = "Nutrient log updated successfully.";
    } else {
      const newLog = new NutrientLog({ username, ...logData });
      result = await newLog.save();
    }

    return res.status(status).json({
      success: true,
      message,
      log: result,
    });
  } catch (error) {
    console.error("Error logging nutrients:", error);
    return res.status(500).json({
      error: "Server error while logging nutrients.",
    });
  }
});