import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
    id: Number,
    name: String,
    moreDataUrl: String,
    spriteUrl: String
});

const pokemon = mongoose.model("pokemon", pokemonSchema);

export default pokemon;