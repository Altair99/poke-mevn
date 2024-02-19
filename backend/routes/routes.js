import { Router } from "express";
import pokemonModel from "../model/pokemon.js";

const router = Router();

// Route to make a call to look for pokemon passing the offset
router.get("/fetch-pokemons", async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 20;
		const offset = Number(req.query.offset) || 0;
		let pokemons;

		pokemons = await pokemonModel
			.find({ pokemonId: { $gt: offset, $lte: offset + limit } })
			.select("pokemonId name height weight types spriteUrl spriteGifUrl")
			.sort({ pokemonId: 1 })
			.exec();

		res.status(200).json({ pokemons: pokemons });
	} catch (error) {
		console.error("Error fetching data:", error);
		res.status(error.response.status).json({ error: error.response.status});
	}
});

router.get("/search-pokemon", async (req, res) => {
	try {
		const name = req.query.name;
		let pokemons;

		// Find pokemon from database
		pokemons = await pokemonModel
			.find({ name: {$regex: "^" + name, $options: "i"} })
			.select("pokemonId name height weight types spriteUrl spriteGifUrl")
			.sort({ pokemonId: 1 })
			.exec();

		res.status(200).json({ pokemons: pokemons });
	} catch (error) {
		console.error("Error fetching data:", error);
		res.status(error.response.status).json({ error: error.response.status });
	}
});

export default router;
