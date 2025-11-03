app.post("/set-nutrient-goals", async (req, res) => {
  const {
    username,
    caloriesGoal,
    proteinGoal,
    fatsGoal,
    carbohydratesGoal,
    waterGoal,
    weightGoal,
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const existingGoals = await NutrientGoals.findOne({ username });

    if (existingGoals) {
      // Update existing goals

      existingGoals.caloriesGoal =
        caloriesGoal !== undefined ? caloriesGoal : existingGoals.caloriesGoal;

      existingGoals.proteinGoal =
        proteinGoal !== undefined ? proteinGoal : existingGoals.proteinGoal;

      existingGoals.fatsGoal =
        fatsGoal !== undefined ? fatsGoal : existingGoals.fatsGoal;

      existingGoals.carbohydratesGoal =
        carbohydratesGoal !== undefined
          ? carbohydratesGoal
          : existingGoals.carbohydratesGoal;

      existingGoals.waterGoal =
        waterGoal !== undefined ? waterGoal : existingGoals.waterGoal;

      existingGoals.weightGoal =
        weightGoal !== undefined ? weightGoal : existingGoals.weightGoal;

      const updatedGoals = await existingGoals.save();

      return res.status(200).json({
        success: true,

        message: "Nutrient goals updated successfully.",

        updatedGoals,
      });
    } else {
      // Create new goals

      const newGoals = new NutrientGoals({
        username,

        caloriesGoal,

        proteinGoal,

        fatsGoal,

        carbohydratesGoal,

        waterGoal,

        weightGoal,
      });

      const savedGoals = await newGoals.save();

      return res.status(201).json({
        success: true,

        message: "Nutrient goals set successfully.",

        savedGoals,
      });
    }
  } catch (error) {
    console.error("Error setting nutrient goals:", error);

    res
      .status(500)
      .json({ error: "Server error while setting nutrient goals." });
  }
});