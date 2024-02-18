import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
    pokemonId: Number,
    name: String,
    height: Number,
    weight: Number,
    types: [String],
    moreDataUrl: String,
    spriteUrl: String
});

const pokemon = mongoose.model("pokemon", pokemonSchema);

export default pokemon;