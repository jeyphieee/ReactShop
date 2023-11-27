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
