import express from "express";
import mongoose from "mongoose";
import routes from "./routes/routes.js";
import axios from "axios";
import pokemonModel from "./model/pokemon.js";

const app = express();
const PORT = 3000;

// Connection to db
mongoose
	.connect("mongodb://mongodb:27017/poke")
	.then(async () => {
		console.log("Connected to MongoDB");

		await fetchAndSavePokemons().then(() => {
			// Use the routes file
			app.use("/api", routes);

			// Start server
			app.listen(PORT, () =>
				console.log("Example app is listening on port 3000.")
			);
		});
	})
	.catch((err) => console.error("Error connecting to MongoDB:", err));

async function fetchAndSavePokemons() {
	try {
		const dbDocumentsNumber = await pokemonModel.countDocuments();
		if (dbDocumentsNumber != 0) return;

		// IMPORTANT: This code only happen when starting a new db and we have no data

		const responseCount = await axios.get(
			`https://pokeapi.co/api/v2/pokemon?limit=1&offset=0`
		);
		const pokemonCount = responseCount.data.count;
		const response = await axios.get(
			`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${pokemonCount}}`
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

				// IMPORTANT: Some pokemons dosent have the svg file so we need to check if null to get the image from folder place
				const spriteUrl =
					pokemonDetail.sprites.other.dream_world.front_default == null
						? pokemonDetail.sprites.front_default
						: pokemonDetail.sprites.other.dream_world.front_default;

				// If the pokemon does not have the sprites from the folder we are looking dont save it to the db
				if (spriteUrl != null) {
					// Save the pokemon data to the database
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
								spriteUrl: spriteUrl,
								// This is just a feature a like to add to show the gif
								spriteGifUrl:
									pokemonDetail.sprites.other.showdown.front_default == null
										? pokemonDetail.sprites.front_default
										: pokemonDetail.sprites.other.showdown.front_default,
							},
						},
						{ upsert: true, new: true }
					);
				}
			})
		);
	} catch (error) {
		console.error(error);
	}
}
