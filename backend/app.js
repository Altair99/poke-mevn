import express from "express";
import mongoose from "mongoose";
import routes from "./routes/routes.js";
import axios from "axios";
import pokemonModel from "./model/pokemon.js";

const app = express();
const PORT = 3000;

// Connection to db
mongoose
	.connect("mongodb://localhost:27017/poke")
	.then(async () => {
		console.log("Connected to MongoDB");

		await fetchAndSavePokemons();

		// Use the routes file
		app.use("/api", routes);

		// Start server
		app.listen(PORT, () =>
			console.log("Example app is listening on port 3000.")
		);
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
			`https://pokeapi.co/api/v2/pokemon?limit=${pokemonCount}&offset=0}`
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
							spriteUrl: pokemonDetail.sprites.front_default,
						},
					},
					{ upsert: true, new: true }
				);
			})
		);
	} catch (error) {
		console.error(error);
	}
}
