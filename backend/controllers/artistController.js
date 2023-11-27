const artist = require('../models/artist');
const slugify = require ("slugify");
// const User = require('../models/user');     

exports.createArtist = async (req, res) => {
    try {
        if (req.body.name) {
            req.body.name = slugify(req.body.name);
        }
        const newartist = await artist.create(req.body);
        res.json(newartist);
    }
    catch (error) {
        throw new Error(error);
    }
};

exports.getAllArtists = async (req, res) => {
    try {
        //filtering 
        const queryObj = { ...req.query};
        const excludefields = ["page","sort", "limit", "fields" ];
        excludefields.forEach ((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        
        let query = artist.find(JSON.parse(queryStr));

        //sorting
        if(req.query.sort){
          const sortBy = req.query.sort.split(",").join("");
          query = query.sort(sortBy);
        }else{
          query = query.sort("-createdAt");
        }

        //limiting fields
        if(req.query.fields){
          const fields = req.query.fields.split(",").join("");
          query = query.select(fields);
        }else{
          query = query.select("__v");
        }

        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page-1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const artistCount = await artist.countDocuments();
            if(skip >= artistCount) throw new Error("This Page Doesn't exist");
        }
        console.log(page, limit, skip);

        const getAllArtists = await artist.find(queryObj)
        res.json(getAllArtists);
    }catch (error) {
        throw new Error(error);
    }
};

exports.getsingleArtist = async (req, res) => {
    const { id } = req.params;
    try {
        const findartist = await artist.findById(id);
        res.json(findartist);
    }
    catch (error) {
        throw new Error(error);
    }
};


exports.updateArtist = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.name) {
            req.body.slug = slugify(req.body.name);
        }
        const updateartist = await artist.findByIdAndUpdate(id , req.body, {new: true});
        res.json(updateartist);
    }
    catch (error) {
        throw new Error(error);
    }
};
