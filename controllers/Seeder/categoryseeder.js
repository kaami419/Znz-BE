const CategoryModel = require("../../models/category");
const csvtojson = require("csvtojson");

exports.categorySeeder = async function (req, res) {
    try {
        const categoryData = await CategoryModel.find({});
       // console.log(categoryData);

        const count = await CategoryModel.count();
     //   console.log(count);
        
        if (categoryData == null) {
            return res.status(200).json({
                message: "Category list Data",
                categoryData,
            });
        }
        else if (categoryData == "") {
            const seedData = [ 
                {
                    category: 'Graphics & Design'
                },
                {
                    category: 'Programming & Tech'
                },
                {
                    category: 'Digital Marketing'
                },
                {
                    category: 'Video & Animation'
                },
                {
                    category: 'Photography'
                },
                {
                    category: 'Web Development'
                },
                {
                    category: 'Mobile App Development'
                },
                {
                    category: 'Game Development'
                },
                {
                    category: 'UI/UX Design'
                },
                {
                    category: 'Illustration'
                },
                {
                    category: '3D Modeling & Rendering'
                },
                {
                    category: 'Data Science & Analytics'
                },
                {
                    category: 'Cybersecurity'
                },
                {
                    category: 'Content Writing & Editing'
                },
                {
                    category: 'Social Media Management'
                },
                {
                    category: 'Search Engine Optimization (SEO)'
                },
                {
                    category: 'E-commerce Development'
                },
                {
                    category: 'Virtual Reality (VR) Development'
                },
                {
                    category: 'Augmented Reality (AR) Development'
                },
                {
                    category: 'Music Production & Audio Engineering'
                }
                 
            ];
            csvtojson()
                .fromFile("public/category.csv")
                .then(async (csvData) => {
                    // console.log(csvData);
                    await CategoryModel
                        .insertMany(seedData)
                        .then((res1) => {
                            // console.log(csvData);
                            return res.status(200).json({
                                message: "Category added successfuly!",
                                // countryCsvData,
                            });
                        });
                });
        }else{
            return res.status(200).json({
                message: "Category already exist",
                categoryData,
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