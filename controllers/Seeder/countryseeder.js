const CountryModel = require("../../models/country");
const csvtojson = require("csvtojson");
const fs = require("fs");

exports.countrySeeder = async function (req, res) {
    try {
        const countryData = await CountryModel.find({});
   //     console.log(countryData);

        const count = await CountryModel.countDocuments();
  //      console.log(count);

        if (count === 0) {
            const countries = await csvtojson().fromFile("public/countries.csv");
      //      console.log(countries);
            const seedData = countries.map((country) => ({ country: country.country }));
   // console.log(seedData);
            await CountryModel.insertMany(seedData)
                .then(() => {
                    return res.status(200).json({
                        message: "Countries added successfully!",
                    });
                })
                .catch((error) => {
                    console.log("Error inserting countries:", error);
                    return res.status(500).json({
                        error: "Failed to insert countries.",
                    });
                });
        } else {
            return res.status(200).json({
                message: "Countries already exist",
                countryData,
            });
        }
    } catch (error) {
        console.log("---------", error);
        return res.status(500).json({
            error: "Something went wrong while working with the country collection.",
        });
    }
};