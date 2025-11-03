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
    return res.status(400).json({ error: "Valid username is required." });
  }

  // Check if at least one goal field is provided
  const hasAtLeastOneGoal = [
    caloriesGoal,
    proteinGoal,
    fatsGoal,
    carbohydratesGoal,
    waterGoal,
    weightGoal,
  ].some((value) => value !== undefined);

  if (!hasAtLeastOneGoal) {
    return res.status(400).json({
      error: "At least one goal field must be provided.",
    });
  }

  try {
    const updatedGoals = await NutrientGoals.findOneAndUpdate(
      { username },
      {
        caloriesGoal,
        proteinGoal,
        fatsGoal,
        carbohydratesGoal,
        waterGoal,
        weightGoal,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        omitUndefined: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: updatedGoals.isNew
        ? "Nutrient goals set successfully."
        : "Nutrient goals updated successfully.",
      goals: updatedGoals,
    });
  } catch (error) {
    console.error("Error setting nutrient goals:", error);
    res
      .status(500)
      .json({ error: "Server error while setting nutrient goals." });
  }
});