const Property = require("../models/propertyModel");
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");

// GET all properties
const getProperties = async (req, res) => {
  const properties = await Property.find({}).sort({ createdAt: -1 });

  res.status(200).json(properties);
};

// GET a property
const getProperty = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Property" });
  }

  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json({ error: "No such Property" });
  }

  res.status(200).json(property);
};

// Add a property
const createProperty = async (req, res) => {
  const { type, location, address, price, area, rooms, beds, statu, contact } =
    req.body;
  const features = req.body.features || [];

  let emptyFields = [];

  if (!type) {
    emptyFields.push("type");
  }
  if (!location) {
    emptyFields.push("location");
  }
  if (!address) {
    emptyFields.push("address");
  }
  if (!price) {
    emptyFields.push("price");
  }
  if (!area) {
    emptyFields.push("area");
  }
  if (!rooms) {
    emptyFields.push("rooms");
  }
  if (!beds) {
    emptyFields.push("beds");
  }
  if (!statu) {
    emptyFields.push("statu");
  }
  if (!req.file) {
    emptyFields.push("image");
  }
  if (!contact) {
    emptyFields.push("contact");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  try {
    const property = await Property.create({
      type,
      location,
      address,
      price,
      area,
      rooms,
      beds,
      statu,
      contact,
      features,
      image: req.file.filename,
      user_id: req.user._id,
    });
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a property
const deleteProperty = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Property" });
  }

  const property = await Property.findOneAndDelete({ _id: id });

  if (!property) {
    return res.status(404).json({ error: "No such Property" });
  }

  if (property.image) {
    const imagePath = path.join("public/images", property.image);
    fs.unlinkSync(imagePath);
  }

  res.status(200).json(property);
};

// UPDATE a property
const updateProperty = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Property" });
  }

  let updateFields = { ...req.body };

  if (req.file) {
    // Delete the old image file
    const property = await Property.findById(id);
    if (property.image) {
      const imagePath = path.join("public/images", property.image);
      fs.unlinkSync(imagePath);
    }

    updateFields.image = req.file.filename;
  }

  const updatedProperty = await Property.findByIdAndUpdate(id, updateFields, {
    new: true,
  });

  if (!updatedProperty) {
    return res.status(404).json({ error: "No such Property" });
  }

  res.status(200).json(updatedProperty);
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  deleteProperty,
  updateProperty,
};
