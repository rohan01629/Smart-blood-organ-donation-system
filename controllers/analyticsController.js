const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");
//GET BLOOD DATA
const bloodGroupDetailsContoller = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodGroupData = [];
    const organisation = new mongoose.Types.ObjectId(req.user.userId);


    // Loop over each blood group and calculate totals
    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        // COUNT TOTAL IN
        const totalIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        // COUNT TOTAL OUT
        const totalOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        // Calculate available blood after donation (in - out)
        const availableBlood =
          (totalIn.length > 0 ? totalIn[0].total : 0) - (totalOut.length > 0 ? totalOut[0].total : 0);

        // Push the data for the current blood group
        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn.length > 0 ? totalIn[0].total : 0,
          totalOut: totalOut.length > 0 ? totalOut[0].total : 0,
          availableBlood,
        });
      })
    );

    return res.status(200).send({
      success: true,
      message: "Blood Group Data Fetched Successfully",
      bloodGroupData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Bloodgroup Data Analytics API",
      error,
    });
  }
};


module.exports = { bloodGroupDetailsContoller };
