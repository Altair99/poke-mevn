import { Router } from "express";
import axios from "axios";
import pokemonModel from "../model/pokemon.js";

const router = Router();

// Route to make a call to look for pokemon passing the offset
router.get("/fetch-pokemons", async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 100;
		const offset = Number(req.query.offset) || 0;
		let pokemons;

		try {
			pokemons = await pokemonModel
				.find({ pokemonId: { $gt: offset, $lte: offset + limit } })
				.select("pokemonId name height weight types spriteUrl")
				.sort({ pokemonId: 1 })
				.exec();
		} catch (error) {
			console.error("Error fetching the pokemons:", error);
		}

		/*
		 *TODO 1: this option ask that the lenght should be the same as the limit
		 * this can cause conflict when asking for the lastest pokemons and the list cannot
		 * return a value == the limit
		 */

		// If the data is not found on the database, fetch the data to the pokeAPI and save to database
		if (pokemons.length != limit) {
			const response = await axios.get(
				`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
			);

			// Fetch the addtional data per pokemon
			await Promise.all(
				response.data.results.map(async (pokemon) => {
					const responseDetails = await axios.get(pokemon.url);
					const pokemonDetail = responseDetails.data;

					// Get the types
					let pokemonTypes = [];
					pokemonDetail.types.forEach((element) =>
						pokemonTypes.push(element.type.name)
					);

					// Save the pokmeon data to the database
					await pokemonModel.findOneAndUpdate(
						{ pokemonId: Number(pokemonDetail.id) },
						{
							$setOnInsert: {
								pokemonId: Number(pokemonDetail.id),
								name: pokemon.name,
								height: Number(pokemonDetail.height),
								weight: Number(pokemonDetail.weight),
								types: pokemonTypes,
								moreDataUrl: pokemon.url,
								spriteUrl: pokemonDetail.sprites.front_default,
							},
						},
						{ upsert: true, new: true }
					);
				})
			);

			try {
				pokemons = await pokemonModel
					.find({ pokemonId: { $gt: offset, $lte: offset + limit } })
					.select("pokemonId name height weight types spriteUrl")
					.sort({ pokemonId: 1 })
					.exec();
			} catch (error) {
				console.error("Error fetching the pokemons:", error);
			}
		}

		res.status(200).json({ pokemons: pokemons });
	} catch (error) {
		console.error("Error fetching data:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/search-pokemon", async (req, res) => {
	try {
		const name = req.query.name;
		let pokemon;

		try {
			// Find pokemon from database
			pokemon = await pokemonModel
				.findOne({ name: name })
				.select("pokemonId name height weight types spriteUrl");
		} catch (error) {
			console.error("Error fetching the pokemons:", error);
		}

		// If the pokemon is not in the database, get the pokemon from the PokeAPI and save to database
		if (pokemon == null) {
			const response = await axios.get(
				`https://pokeapi.co/api/v2/pokemon/${name}`
			);
			const pokemonDetail = response.data;

			// Get the types
			let pokemonTypes = [];
			pokemonDetail.types.forEach((element) =>
				pokemonTypes.push(element.type.name)
			);

			// TODO: Error handling if the pokemon is not found

			// Save the pokmeon data to the database
			await pokemonModel.findOneAndUpdate(
				{ pokemonId: Number(pokemonDetail.id) },
				{
					$setOnInsert: {
						pokemonId: Number(pokemonDetail.id),
						name: pokemonDetail.name,
						height: Number(pokemonDetail.height),
						weight: Number(pokemonDetail.weight),
						types: pokemonTypes,
						moreDataUrl: `https://pokeapi.co/api/v2/pokemon/${pokemonDetail.id}`,
						spriteUrl: pokemonDetail.sprites.front_default,
					},
				},
				{ upsert: true, new: true }
			);

			try {
			// Find pokemon from database
			pokemon = await pokemonModel
				.findOne({ name: name })
				.select("pokemonId name height weight types spriteUrl");
			} catch (error) {
				console.error("Error fetching the pokemons:", error);
			}
		}

		res.status(200).json({ pokemon: pokemon });
	} catch (error) {
		console.error("Error fetching data:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
