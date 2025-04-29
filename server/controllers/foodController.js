import Food from "../models/foodModel.js";

export const getFoods = async (req, res) => {
    try {
      const foods = await Food.find();
      res.json({ success: true, foods });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  export const getFoodById = async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);
      if (!food) {
        return res.status(404).json({ success: false, message: "Không tìm thấy món ăn" });
      }
      res.json({ success: true, food });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }; 
  
