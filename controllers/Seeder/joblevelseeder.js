const JoblevelModel = require("../../models/Joblevel");
const csvtojson = require("csvtojson");

exports.jobLevelSeeder = async function (req, res) {
    try {
        const jobLevelData = await JoblevelModel.find({});
     //   console.log(jobLevelData);

        const count = await JoblevelModel.countDocuments();
     //   console.log(count);
        
        if (jobLevelData == null) {
            return res.status(200).json({
                message: "jobLevel list Data",
                jobLevelData,
            });
        }
        else if (jobLevelData == "") {
            const seedData = [ 
                {
                    Joblevels: 'Beginner'
                },  
                {
                    Joblevels: 'Intermediate'
                  
                },
                {
                    Joblevels: 'Experienced'
                },
            ];
            csvtojson()
                .fromFile("public/joblevel.csv")
                .then(async (csvData) => {
                    // console.log(csvData);
                    await JoblevelModel
                        .insertMany(seedData)
                        .then((res1) => {
                            // console.log(csvData);
                            return res.status(200).json({
                                message: "Joblevel added successfuly!",
                                // countryCsvData,
                            });
                        });
                });
        }else{
            return res.status(200).json({
                message: "Joblevel already exist",
                jobLevelData,
            });
        }
    } catch (error) {
        console.log("---------", error);
        return res.status(500).json({
            error:
                "Something went wrong which is why category collection is not working",
        });
    }
};