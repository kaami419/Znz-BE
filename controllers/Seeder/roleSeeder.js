const rolemodel = require("../../models/role");
const csvtojson = require("csvtojson");

exports.roleSeeder = async function (req, res) {
    try {
        const roleData = await rolemodel.find({});
      //  console.log(roleData);

        const count = await rolemodel.count();
     //   console.log(count);
        
        if (roleData == null) {
            return res.status(200).json({
                message: "role list Data",
                roleData,
            });
        }
        else if (roleData == "") {
            const seedData = [ 
                {
                    role: 'admin'
                },
                {
                    role: 'seller'
                },
                {
                    role: 'buyer'
                },
              ];
            csvtojson()
                .fromFile("public/role.csv")
                .then(async (csvData) => {
                    // console.log(csvData);
                    await rolemodel
                        .insertMany(seedData)
                        .then((res1) => {
                            // console.log(csvData);
                            return res.status(200).json({
                                message: "role added successfuly!",
                                // countryCsvData,
                            });
                        });
                });
        }else{
            return res.status(200).json({
                message: "role already exist",
                roleData,
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