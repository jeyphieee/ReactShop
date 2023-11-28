const artist = require('../models/artist');
const slugify = require ("slugify");
const APIFeatures = require('../utils/apiFeatures')

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

exports.getAllArtists = async (req, res, next) => {
	// const products = await Product.find({});
	const resPerPage = 4;
	const artistCount = await artist.countDocuments();
	const apiFeatures = new APIFeatures(artist.find(), req.query).search().filter()
	apiFeatures.pagination(resPerPage);
	const artists = await apiFeatures.query;
	const filteredArtistCount = artist.length
	if (!artists) {
		return res.status(404).json({
			success: false,
			message: 'No Products'
		})
	}
	res.status(200).json({
		success: true,
		count: artist.length,
		artistCount,
		artists,
		resPerPage,
		filteredArtistCount,
	})
}

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

exports.deleteArtist = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteartist = await artist.findOneAndDelete(id); 
        res.json(deleteartist);
    }
    catch (error) {
        throw new Error(error);
    }
};