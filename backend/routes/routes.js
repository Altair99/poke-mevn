import { Router, response } from "express";
import axios from "axios";
import pokemonModel from "../model/pokemon.js";
import NodeCache from "node-cache";

const router = Router();
const cache = new NodeCache({ stdTTL: 3600 }); // Set cache TTL to 1 hour

// Route to make a call to look for pokemon passing the offset
router.get("/fetch-pokemons", async (req, res) => {
	try {
		const limit = req.query.limit || 100;
		const offset = req.query.offset || 0;

		// Get the info first from database
		let pokemons = await pokemonModel.find().limit(limit).skip(offset);

		/*
		 *TODO: I have to take into account when the pokemons are not 0
		 * but dosent show the correct list. Im searching by limit and offset
		 * but if the limit change or the offset I could have a imcompleted list
		 */

         /*
		 *TODO 2: Second option to ask that the lenght should be the same as the limit
         * this can cause conflict when asking for the lastest pokemons and the list cannot
         * return a value == the limit
		 */

		// If the data is not found on the database, fetch the data to the pokeAPI and save to database
		// if (pokemons.length == 0) {
            if (pokemons.length != limit) {
			const response = await axios.get(
				`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
			);

			// Fetch the addtional data per pokemon
			pokemons = await Promise.all(
				response.data.results.map(async (pokemon) => {
					const responseDetails = await axios.get(pokemon.url);

					// Save the pokmeon data to the database
					const savedPokemon = await pokemonModel.findOneAndUpdate(
						{ id: Number(responseDetails.data.id) },
						{
							$setOnInsert: {
								id: Number(responseDetails.data.id),
								name: pokemon.name,
								moreDataUrl: pokemon.url,
								spriteUrl: responseDetails.data.sprites.front_default,
							},
						},
						{ upsert: true, new: true }
					);

					return savedPokemon;
				})
			);
		}

		//TODO: We can have the a copy of all the images locally in a folder to reduce the fetching
		const cachedSprites = {};
		/* 
            We need to check if all the images from pokemon are in the cache, 
            if not get them from PokeAPI an save to the cache
        */
		for (const pokemon of pokemons) {
			const spriteKey = `sprite:${pokemon.id}`;
			let cachedSprite = cache.get(spriteKey);

			if (!cachedSprite) {
				// Lets cache the sprite url
				cache.set(spriteKey, pokemon.spriteUrl);
				cachedSprite = pokemon.spriteUrl;
			}

			cachedSprites[pokemon.id] = cachedSprite;
		}

		res.status(200).json({ pokemon: pokemons, sprites: cachedSprites });
	} catch (error) {
		console.error("Error fetching data:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/search-pokemon", async (req, res) => {
	try {
		const name = req.query.name;

		// Find pokemon from database
		let pokemon = await pokemonModel.findOne({name: name});

		// If the pokemon is not in the database, get the pokemon from the PokeAPI and save to database
		if (pokemon == null) {
			const response = await axios.get(
				`https://pokeapi.co/api/v2/pokemon/${name}`
			);

			// Save the pokmeon data to the database
			pokemon = await pokemonModel.findOneAndUpdate(
				{ id: Number(response.data.id) },
				{
					$setOnInsert: {
						id: Number(response.data.id),
						name: response.data.name,
						moreDataUrl: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
						spriteUrl: response.data.sprites.front_default,
					},
				},
				{ upsert: true, new: true }
			);
		}

		const spriteKey = `sprite:${(pokemon, name)}`;
		cache.set(spriteKey, pokemon.spriteUrl);

		res.status(200).json({ pokemon: pokemon, sprites: pokemon.spriteUrl });
	} catch (error) {
		console.error("Error fetching data:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
